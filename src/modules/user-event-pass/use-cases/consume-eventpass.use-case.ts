import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';

import { UserEventPass } from '../entities/user-event-pass.entity';
import { EventPass } from 'src/modules/event-pass/entities/event-pass.entity';

export interface ConsumeEventPassUseCaseInput {
  userEventPassId: string;
  eventPassId: string;
}

@Injectable()
export class ConsumeEventPassUseCase {
  async execute(
    manager: EntityManager,
    input: ConsumeEventPassUseCaseInput,
  ): Promise<UserEventPass> {
    const { userEventPassId, eventPassId } = input;

    // 1️⃣ Buscar entrada adquirida con su EventPass y usuario
    const userPass = await manager.findOne(UserEventPass, {
      where: { id: userEventPassId },
      relations: { event_pass: true },
      lock: { mode: 'pessimistic_write' },
    });

    const eventPass = await manager.findOne(EventPass, {
      where: { id: eventPassId },
      lock: { mode: 'pessimistic_write' },
    });

    if (!userPass) {
      throw new NotFoundException('Entrada de usuario no encontrada.');
    }
    if (!eventPass) {
      throw new NotFoundException('Entrada no encontrada.');
    }

    if (userPass.event_pass_id !== eventPassId) {
      throw new BadRequestException('La entrada que estás intentando usar no pertenece a este evento.');
    }

    // 2️⃣ Validaciones básicas
    if (!userPass.is_active) {
      throw new BadRequestException('Esta entrada no está activa.');
    }
    if (userPass.is_consumed) {
      throw new BadRequestException('Esta entrada ya fue utilizada.');
    }
    if (userPass.is_refunded) {
      throw new BadRequestException('Esta entrada fue reembolsada y no puede usarse.');
    }

    // 3️⃣ Marcar como consumida
    userPass.is_consumed = true;
    userPass.redemption_date = new Date();
    await manager.save(UserEventPass, userPass);

    // 4️⃣ Actualizar conteo de asistencias
    eventPass.attended_count = Number(eventPass.attended_count) + 1;
    await manager.save(EventPass, eventPass);

    return userPass;
  }
}
