import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { DataSource, In } from "typeorm";
import { OrderItem } from "./entities/order-item.entity";
import { OrderItemConsumption } from "./entities/order-item-consumptions.entity";
import { GroupMember } from "../group-members/entities/group-member.entity";

@Injectable()
export class OrderItemConsumptionService {
  constructor(
    private readonly dataSource: DataSource,
  ) {}

    async markConsumed(
    orderItemIds: string[],
    userId: string,
    ): Promise<{success: boolean, message: string}> {

    return await this.dataSource.transaction(async manager => {

        // 1️⃣ traer items
        const items = await manager.find(OrderItem, {
        where: { id: In(orderItemIds) },
        relations: ['order'],
        });

        if (!items.length) {
        throw new BadRequestException('No hay productos válidos');
        }

        // 2️⃣ validar misma orden
        const orderId = items[0].order_id;
        if (items.some(i => i.order_id !== orderId)) {
        throw new BadRequestException(
            'Todos los productos deben pertenecer a la misma orden',
        );
        }

        const order = items[0].order;

        // 3️⃣ validar orden grupal
        if (!order.group_id) {
        throw new BadRequestException('La orden no es grupal');
        }

        // 4️⃣ validar que AÚN NO pasó el reciclador
        if (order.collected_at) {
        throw new BadRequestException(
            'El consumo ya no puede modificarse',
        );
        }

        // 5️⃣ validar pertenencia al grupo
        const isMember = await manager.findOne(GroupMember, {
        where: {
            group_id: order.group_id,
            user_id: userId,
        },
        });

        if (!isMember) {
        throw new ForbiddenException('El usuario no pertenece al grupo');
        }

        // 6️⃣ borrar consumos previos del usuario (reemplazo total)
        await manager.delete(OrderItemConsumption, {
        user_id: userId,
        order_item_id: In(
            items.map(i => i.id),
        ),
        });

        // 7️⃣ insertar nuevos consumos
        if (orderItemIds.length) {
        const toInsert = orderItemIds.map(itemId => ({
            order_item_id: itemId,
            user_id: userId,
        }));

        await manager.insert(OrderItemConsumption, toInsert);
        return {success: true, message: "Sus consumos fueron almacenados con éxito"}
        }
    });
    }


}
