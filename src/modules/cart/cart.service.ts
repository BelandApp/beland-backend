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

@Injectable()
export class CartsService {
  private readonly completeMessage = 'el carrito';

  constructor(
    private readonly repository: CartsRepository,
    private readonly deliveryService: DeliveryService,
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

      const deliveryInfo = await this.deliveryService.calculateFinalDeliveryForAddress(cart.address_id);

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
