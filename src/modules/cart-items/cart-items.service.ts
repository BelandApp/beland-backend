import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CartItem } from './entities/cart-item.entity';
import { CartItemsRepository } from './cart-items.repository';

@Injectable()
export class CartItemsService {
  private readonly completeMessage = 'el item del carrito';

  constructor(private readonly repository: CartItemsRepository) {}

  async findAll(
    cart_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[CartItem[], number]> {
    try {
      const response = await this.repository.findAll(
        cart_id,
        pageNumber,
        limitNumber,
      );
      return response;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<CartItem> {
    try {
      const res = await this.repository.findOne(id);
      if (!res)
        throw new NotFoundException(`No se encontro ${this.completeMessage}`);
      return res;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(body: Partial<CartItem>): Promise<CartItem> {
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

  async update(id: string, body: Partial<CartItem>) {
    try {
      // Obtener el item actual
      const item = await this.repository.findOne( id );

      if (!item) {
        throw new NotFoundException(`No se encontró el item del carrito`);
      }

      // Si la cantidad viene en la petición...
      if (body.quantity !== undefined) {
        const newQuantity = Number(body.quantity);

        // Si la cantidad es 0 → eliminar el ítem
        if (newQuantity === 0) {
          await this.repository.remove(id);
          return { message: 'Item eliminado porque la cantidad es 0' };
        }

        // Si la cantidad es mayor a 0 → recalcular totales
        body.total_price = Number(item.unit_price) * newQuantity;
        body.total_becoin = Number(item.unit_becoin) * newQuantity;
        body.total_weight = Number(item.unit_weight) * newQuantity;
      }

      // Merge y guardar (dispara los hooks si los tuvieras)
      const updated = await this.repository.save({
        ...item,
        ...body,
      });

      return updated;

    } catch (error) {
      throw new InternalServerErrorException(JSON.stringify(error));
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
      throw new ConflictException(`No se puede eliminar ${this.completeMessage}: ${JSON.stringify(error)}`);
    }
  }
}
