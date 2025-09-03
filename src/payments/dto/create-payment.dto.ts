// src/payments/dto/create-payment.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import {
  IsUUID,
  IsNumber,
} from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID de la orden asociada al pago' })
  @IsUUID()
  order_id: string;

  @ApiProperty({ description: 'ID del usuario que realiza el pago' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ description: 'Monto pagado por el usuario' })
  @IsNumber()
  amount_paid: number;

  @ApiProperty({
    description: 'UUID Tipo de pago',
  })
  @IsUUID()
  payment_type_id: string;

  @ApiProperty({
    description: 'UUID estado de pago',
  })
  @IsUUID()
  status_id?: string;

}
