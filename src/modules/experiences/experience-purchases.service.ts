import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ExperiencePurchase } from './entities/experience-purchase.entity';
import { ExperiencePurchaseItem } from './entities/experience-purchase-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateExperiencePurchaseDto } from './dto/create-experience-purchase.dto';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';
import { PaymentProviderEnum } from '../transactions/enums/transaction.enums';

@Injectable()
export class ExperiencePurchasesService {
  private readonly logger = new Logger(ExperiencePurchasesService.name);

  constructor(
    @InjectRepository(ExperiencePurchase)
    private readonly purchaseRepo: Repository<ExperiencePurchase>,
    private readonly dataSource: DataSource,
    private readonly superadminConfig: SuperadminConfigService,
  ) {}

  async createPurchase(dto: CreateExperiencePurchaseDto): Promise<ExperiencePurchase> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('La compra debe incluir al menos un item.');
    }

    // Validación: TRANSFER NO está permitido para reservas.
    if (dto.is_reserved && dto.payment_method === 'TRANSFER') {
      throw new BadRequestException('El método de pago TRANSFER no está permitido para reservas.');
    }
    
    // Validación de TRANSFER: No debe enviar payphone_transaction_id
    if (dto.payment_method === 'TRANSFER' && dto.payphone_transaction_id) {
      throw new BadRequestException('No se debe enviar payphone_transaction_id cuando el método de pago es TRANSFER.');
    }

    // Validación de ID de transacción si no es reserva sin pago (reserva sin pago usa PAYPHONE pero sin tx_id)
    if (!dto.is_reserved && !dto.payphone_transaction_id && dto.payment_method === 'PAYPHONE') {
      throw new BadRequestException('El ID de transacción es obligatorio para compras inmediatas con PAYPHONE.');
    }
    if (dto.is_reserved && dto.payment_method === 'PAYPHONE' && !dto.payphone_transaction_id) {
        // Reserva sin pago (permitido). Pero si envían transaction_id será reserva pagada.
    }

    return await this.dataSource.transaction(async (manager) => {
      // 1. Validar idempotencia si hay ID de transacción
      if (dto.payphone_transaction_id) {
        const existing = await manager.findOne(ExperiencePurchase, {
          where: { payphone_transaction_id: dto.payphone_transaction_id },
        });
        if (existing) {
          throw new BadRequestException('El payphone_transaction_id ya fue utilizado.');
        }
      }

      // 2. Validar productos y recalcular total
      let calculatedTotal = 0;
      const itemsToSave: ExperiencePurchaseItem[] = [];

      for (const itemDto of dto.items) {
        const product = await manager.findOne(Product, {
          where: { id: itemDto.product_id, is_experience: true },
        });

        if (!product || product.deleted_at !== null) {
          throw new BadRequestException(`El producto ${itemDto.product_id} no es una Experience válida o no existe.`);
        }

        const unitPrice = Number(product.price);
        const subtotal = unitPrice * itemDto.quantity;
        calculatedTotal += subtotal;

        const purchaseItem = new ExperiencePurchaseItem();
        purchaseItem.product_id = product.id;
        purchaseItem.quantity = itemDto.quantity;
        purchaseItem.unit_price = unitPrice;
        purchaseItem.subtotal = subtotal;

        itemsToSave.push(purchaseItem);
      }

      // Evitar errores de coma flotante convirtiendo a fixed 2 decimales
      const calculatedTotalFixed = Number(calculatedTotal.toFixed(2));
      const frontendTotalFixed = Number(dto.total_amount.toFixed(2));

      if (calculatedTotalFixed !== frontendTotalFixed) {
        throw new BadRequestException(
          `El monto total no coincide. Calculado en backend: ${calculatedTotalFixed}, Recibido: ${frontendTotalFixed}`,
        );
      }

      // 3. Determinar estado y cashback
      let status = 'ENTREGADO';
      let orangeAmount = 0;
      let calculateCashback = false;

      if (!dto.is_reserved) {
        status = 'ENTREGADO';
        calculateCashback = true;
      } else {
        if (dto.payphone_transaction_id) {
          status = 'PAGADO'; // Reserva pagada
          calculateCashback = true;
        } else {
          status = 'RESERVADO'; // Reserva sin pago
          calculateCashback = false;
        }
      }

      if (calculateCashback) {
         let providerEnum = PaymentProviderEnum.PAYPHONE;
         if (dto.payment_method === 'TRANSFER') {
            providerEnum = PaymentProviderEnum.TRANSFER;
         }
         
         const commissionPercent = this.superadminConfig.getRechargeCommission(providerEnum);
         if (commissionPercent > 0) {
           const priceOneBecoin = Number(this.superadminConfig.getPriceOneBecoin());
           const totalBeCoins = Math.floor(calculatedTotalFixed / priceOneBecoin);
           orangeAmount = Math.floor(totalBeCoins * commissionPercent);
         }
      }

      // 4. Crear y guardar la compra
      const purchase = new ExperiencePurchase();
      purchase.payphone_transaction_id = dto.payphone_transaction_id || null;
      purchase.email = dto.email;
      purchase.phone = dto.phone;
      purchase.total_amount = calculatedTotalFixed;
      purchase.currency = 'USD';
      purchase.status = status;
      purchase.is_reserved = dto.is_reserved;
      purchase.payment_method = dto.payment_method;
      purchase.orange_reward_amount = orangeAmount;
      purchase.orange_reward_credited = false;
      purchase.items = itemsToSave;

      const savedPurchase = await manager.save(ExperiencePurchase, purchase);
      
      return savedPurchase;
    });
  }

  async updateStatusToDelivered(id: string): Promise<ExperiencePurchase> {
    const purchase = await this.purchaseRepo.findOne({ where: { id } });
    if (!purchase) {
      throw new BadRequestException(`Compra ${id} no encontrada.`);
    }
    if (purchase.status === 'ENTREGADO') {
      return purchase;
    }
    purchase.status = 'ENTREGADO';
    return await this.purchaseRepo.save(purchase);
  }

  async findAll(page: number = 1, limit: number = 10) {
    const [items, total] = await this.purchaseRepo.findAndCount({
      relations: ['items', 'items.product'],
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
    
    return {
      data: items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<ExperiencePurchase> {
    const purchase = await this.purchaseRepo.findOne({
      where: { id },
      relations: ['items', 'items.product'],
    });

    if (!purchase) {
      throw new BadRequestException(`Compra ${id} no encontrada.`);
    }

    return purchase;
  }
}
