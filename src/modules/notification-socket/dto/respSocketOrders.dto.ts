import { ApiProperty } from '@nestjs/swagger';

export class RespSocketOrdersDto {
  @ApiProperty({
    description: 'UUID de la orden.',
  })
  order_id: string;

  @ApiProperty({
    example: 200,
    description: 'Total de la orden en Becoin.',
  })
  total_becoin: number;

  @ApiProperty({
    example: 4,
    description: 'Nombre del usuario que utilizó la entrada.',
  })
  items: number;

}
