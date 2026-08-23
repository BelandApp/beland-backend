import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ExperiencePurchase } from './entities/experience-purchase.entity';
import { ExperiencePurchaseItem } from './entities/experience-purchase-item.entity';
import { Product } from '../products/entities/product.entity';
import { CreateExperiencePurchaseDto } from './dto/create-experience-purchase.dto';

@Injectable()
export class ExperiencePurchasesService {
  private readonly logger = new Logger(ExperiencePurchasesService.name);

  constructor(
    @InjectRepository(ExperiencePurchase)
    private readonly purchaseRepo: Repository<ExperiencePurchase>,
    private readonly dataSource: DataSource,
  ) {}

  async createPurchase(dto: CreateExperiencePurchaseDto): Promise<ExperiencePurchase> {
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestException('La compra debe incluir al menos un item.');
    }

    return await this.dataSource.transaction(async (manager) => {
      // 1. Validar idempotencia
      const existing = await manager.findOne(ExperiencePurchase, {
        where: { payphone_transaction_id: dto.payphone_transaction_id },
      });
      if (existing) {
        throw new BadRequestException('El payphone_transaction_id ya fue utilizado.');
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

      // 3. Crear y guardar la compra
      const purchase = new ExperiencePurchase();
      purchase.payphone_transaction_id = dto.payphone_transaction_id;
      purchase.email = dto.email || null;
      purchase.total_amount = calculatedTotalFixed;
      purchase.currency = 'USD';
      purchase.status = 'COMPLETED';
      purchase.items = itemsToSave;

      const savedPurchase = await manager.save(ExperiencePurchase, purchase);
      
      // Devolver sin la relación con items ni info sensible para respuesta simplificada
      return savedPurchase;
    });
  }
}
