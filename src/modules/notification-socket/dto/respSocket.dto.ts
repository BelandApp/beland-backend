import { ApiProperty } from '@nestjs/swagger';

export class RespSocketDto {
  @ApiProperty({
    example: '6f34bda2-912a-4a0a-8d8a-1b06a3efb9c4',
    description: 'Identificador único de la wallet asociada al evento.',
  })
  wallet_id: string;

  @ApiProperty({
    example: 'Transacción procesada correctamente.',
    description: 'Mensaje informativo sobre el resultado del proceso.',
  })
  message: string;

  @ApiProperty({
    example: 150.75,
    description: 'Monto involucrado en la operación.',
  })
  amount: number;

  @ApiProperty({
    example: true,
    description: 'Indica si la operación se realizó con éxito.',
  })
  success: boolean;

  @ApiProperty({
    example: 'b2f8f2f0-7ab4-4f1b-8f2a-d5e2c66d28cd',
    description: 'ID del pago eliminado, si aplica. Puede ser nulo.',
    required: false,
    nullable: true,
  })
  amount_payment_id_deleted?: string | null;

  @ApiProperty({
    example: false,
    description:
      'Indica si el mensaje debe mostrarse sin ocultarse (visible públicamente o no).',
  })
  noHidden: boolean;
}
