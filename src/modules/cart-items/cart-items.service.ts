import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CartItem } from './entities/cart-item.entity';
import { CartItemsRepository } from './cart-items.repository';
import { DataSource } from 'typeorm';

@Injectable()
export class CartItemsService {

  private readonly completeMessage = 'el item del carrito';

  constructor(
    private readonly repository: CartItemsRepository,
    private readonly dataSource: DataSource,
  ) {}

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

  async findAllUserOrGeneral(
    cart_id: string,
    user_id: string,
    pageNumber: number,
    limitNumber: number,
  ): Promise<[CartItem[], number]> {
    try {
      const response = await this.repository.findAllUserOrGeneral(
        cart_id,
        user_id,
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

  async updateQuantityProduct(product_id: string, cart_id: string, quantity: number, user_id?: string | null) {
    const item = await this.repository.findByProduct( product_id, cart_id, user_id);
    if (!item) throw new NotFoundException(`No se encontró el producto del carrito`);

    return await this.update (item.id, {quantity})
  }

  async update(id: string, body: Partial<CartItem>) {
    try {
      // Obtener el item actual
      const item = await this.repository.findOne( id );

      if (!item) {
        throw new NotFoundException(`No se encontró el item del carrito`);
      }

      // Si la cantidad viene en la petición...
      if (body.quantity !== undefined ) {
        const newQuantity = Number(body.quantity);

        // Si la cantidad es 0 → eliminar el ítem
        if (newQuantity === 0) {
          await this.remove(id);
          return { message: 'Item eliminado porque la cantidad es 0' };
        }

        if (item.product.quantity < newQuantity) {
          throw new ConflictException(`Stock insuficiente. Solo quedan ${item.product.quantity}`);
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

  // async removeProduct(product_id: string, cart_id: string) {
  // const queryRunner = this.dataSource.createQueryRunner();

  // await queryRunner.connect();
  // await queryRunner.startTransaction();

  // try {
  //   // 1. Buscar el ítem ANTES de eliminarlo
  //   // Necesitamos saber si tenía un user_id para decidir qué balance recalcular
  //   const item = await queryRunner.manager.findOne(CartItem, {
  //     where: { product_id, cart_id },
  //   });

  //   if (!item) {
  //     throw new NotFoundException('Producto no encontrado en el carrito');
  //   }

  //   const userId = item.user_id;

  //   // 2. Eliminar el ítem de la base de datos
  //   const deleteResult = await queryRunner.manager.delete(CartItem, item.id);

  //   if (deleteResult.affected === 0) {
  //     throw new NotFoundException(`No se pudo eliminar el producto`);
  //   }

  //   // 3. Recalcular balances
  //   // Como el ítem ya no existe en la DB, las funciones de recálculo
  //   // obtendrán el nuevo total correcto (sin este producto).
  //   if (userId) {
  //     // Caso Personal
  //     await this.repository.recalculateUserPersonalBalance(cart_id, userId, queryRunner);
  //   } else {
  //     // Caso compartido/general
  //     await this.repository.recalculateSharedBalances(cart_id, queryRunner);
  //   }

  //   // 4. Confirmar cambios
  //   await queryRunner.commitTransaction();
    
  //   return { 
  //     success: true, 
  //     message: 'Producto eliminado y balance actualizado correctamente' 
  //   };

  // } catch (error) {
  //   // Si algo falla (ej: error en recálculo), el ítem NO se elimina
  //   await queryRunner.rollbackTransaction();
    
  //   if (error instanceof NotFoundException) throw error;
    
  //   throw new ConflictException(
  //     `No se pudo eliminar el producto: ${error}`
  //   );
  // } finally {
  //   // Liberar el recurso
  //   await queryRunner.release();
  // }
  // }

  async remove(id: string) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Obtener los datos del ítem antes de borrarlo
      const item = await queryRunner.manager.findOne(CartItem, {
        where: { id },
      });

      if (!item) {
        throw new NotFoundException(`No se encontró el ítem con ID: ${id}`);
      }

      // Guardamos las referencias necesarias para el recálculo
      const { cart_id, user_id } = item;

      // 2. Eliminar el ítem
      const deleteResult = await queryRunner.manager.delete(CartItem, id);

      if (deleteResult.affected === 0) {
        throw new NotFoundException(`No se pudo eliminar el ítem`);
      }

      // 3. Recalcular según el tipo de ítem que era
      if (user_id) {
        // Si el ítem pertenecía a alguien, recalculamos su balance personal
        await this.repository.recalculateUserPersonalBalance(cart_id, user_id, queryRunner);
      } else {
        // Si era un ítem general, recalculamos el reparto del grupo
        await this.repository.recalculateSharedBalances(cart_id, queryRunner);
      }

      // 4. Confirmar transacción
      await queryRunner.commitTransaction();

      return { 
        success: true, 
        message: 'Ítem eliminado y balance actualizado' 
      };

    } catch (error) {
      // Si algo falla, revertimos: el ítem no se borra
      await queryRunner.rollbackTransaction();

      if (error instanceof NotFoundException) throw error;

      throw new ConflictException(
        `Error al eliminar el ítem: ${error}`
      );
    } finally {
      // Liberar el queryRunner siempre
      await queryRunner.release();
    }
  }
}
