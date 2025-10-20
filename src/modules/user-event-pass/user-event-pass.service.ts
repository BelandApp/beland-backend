import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UserEventPassRepository } from './user-event-pass.repository';
import { UserEventPass } from './entities/user-event-pass.entity';
import { UserEventPassFiltersDto } from './dto/user-eventpass-filters.dto';

@Injectable()
export class UserEventPassService {
  constructor(private readonly repository: UserEventPassRepository) {}

  /**
   * 🔍 Obtener todas las entradas adquiridas (admin o usuario)
   * Soporta paginación y filtros dinámicos
   */
  async findAll(
    page: number,
    limit: number,
    filters?: UserEventPassFiltersDto,
  ): Promise<[UserEventPass[], number]> {
    return this.repository.findAll(page, limit, filters);
  }

  /**
   * 🔎 Obtener una entrada específica
   */
  async findOne(id: string): Promise<UserEventPass> {
    const userPass = await this.repository.findOne(id);
    if (!userPass) throw new NotFoundException('Entrada no encontrada.');
    return userPass;
  }

  /**
   * 🎟️ Comprar/Adquirir un EventPass
   */
  async purchaseEventPass(
    user_id: string,
    event_pass_id: string,
    holder_name: string,
    holder_phone?: string,
    holder_document?: string,
  ): Promise<UserEventPass> {
    return this.repository.purchaseEventPass(
      user_id,
      event_pass_id,
      holder_name,
      holder_phone,
      holder_document,
    );
  }

  /**
   * 🔄 Reembolso/Devolución de EventPass
   */
  async refundEventPass(
    user_id: string,
    user_eventpass_id: string,
  ): Promise<UserEventPass> {
    return this.repository.refundEventPass(user_id, user_eventpass_id);
  }

  /**
   * ✅ Marcar como consumida la entrada al validar QR
   * Se puede agregar lógica para notificar al comercio
   */
  async consumeEventPass(
    user_eventpass_id: string,
    eventpass_id: string,
  ): Promise<{ success: boolean; message: string; userEventPass?: UserEventPass }> {
    return this.repository.consumeEventPass(user_eventpass_id, eventpass_id);
  }


}
