import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Cart } from './entities/cart.entity';
import { CartsRepository } from './cart.repository';
import { DeliveryService } from '../delivery/delivery.service';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';
import { UserAddressService } from '../user-address/user-address.service';

@Injectable()
export class CartsService {
  private readonly completeMessage = 'el carrito';

  constructor(
    private readonly repository: CartsRepository,
    private readonly deliveryService: DeliveryService,
    private readonly superadminConfigService: SuperadminConfigService,
    private readonly userAddressService: UserAddressService,
  ) {}

  async findByUser(user_id: string): Promise<Cart> {
    try {
      const res = await this.repository.findByUser(user_id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<Cart> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<Cart>): Promise<Cart> {
    try {
      const res = await this.repository.create(body);
      if (!res)
        throw new InternalServerErrorException(
          `No se pudo crear ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateCleanCart(id: string): Promise<Cart> {
    try {
      const res = await this.repository.updateCleanCart(id);
      if (!res)
        throw new InternalServerErrorException(
          `No se pudo Limpiar ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: string, body: Partial<Cart>) {
    try {
      const res = await this.repository.update(id, body);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async calculateAndSaveDelivery(id: string): Promise<Cart> {
    try {
      const cart = await this.repository.findOne(id);
      if (!cart) {
        throw new NotFoundException(`No se encontró ${this.completeMessage}`);
      }

      if (!cart.address_id) {
        throw new BadRequestException('El carrito no tiene una dirección de entrega asignada');
      }

      const customerAddress = await this.userAddressService.findOne(cart.address_id);
      if (!customerAddress || !customerAddress.latitude || !customerAddress.longitude) {
        throw new BadRequestException('La dirección de entrega no es válida o no tiene coordenadas');
      }

      const superadminId = this.superadminConfigService.getSuperadminId();
      if (!superadminId) {
        throw new InternalServerErrorException('No se ha configurado un SuperAdmin en el sistema');
      }

      const [superadminAddresses] = await this.userAddressService.findAll(superadminId, 1, 10);
      if (!superadminAddresses || superadminAddresses.length === 0) {
        throw new InternalServerErrorException('El SuperAdmin no tiene una dirección configurada');
      }

      let originAddress = superadminAddresses.find(a => a.isDefault);
      if (!originAddress) {
        originAddress = superadminAddresses[0];
      }

      if (!originAddress.latitude || !originAddress.longitude) {
        throw new InternalServerErrorException('La dirección del SuperAdmin no tiene coordenadas configuradas');
      }

      const deliveryInfo = await this.deliveryService.getDeliveryInfo(
        { lat: Number(originAddress.latitude), lon: Number(originAddress.longitude) },
        { lat: Number(customerAddress.latitude), lon: Number(customerAddress.longitude) },
      );

      await this.repository.update(id, {
        distance_km: deliveryInfo.distanceKm,
        duration_min: deliveryInfo.durationMin,
        delivery_cost: deliveryInfo.cost,
      });

      return await this.repository.findOne(id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException ||
        error instanceof InternalServerErrorException
      ) {
        throw error;
      }
      throw new InternalServerErrorException('Error al calcular el delivery');
    }
  }

  async remove(id: string) {
    try {
      const res = await this.repository.remove(id);
      if (res.affected === 0)
        throw new NotFoundException(
          `No se encontró ${this.completeMessage}`,
        );
      return res;
    } catch (error) {
      throw new ConflictException(`No se puede eliminar ${this.completeMessage}`);
    }
  }

}
