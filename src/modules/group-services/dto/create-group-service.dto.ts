import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateGroupServiceDto {
  @ApiProperty({
    description: 'ID del grupo',
    format: 'uuid',
    example: 'b3c6c2d1-2e4c-4b6a-9d1a-8f2d3a9c1234',
  })
  @IsUUID()
  group_id: string;

  @ApiProperty({
    description: 'ID del servicio contratado (ej: Musicalización, Limpieza)',
    format: 'uuid',
    example: 'a91f1c77-7d4e-4e1c-9b2f-1b7a8c456789',
  })
  @IsUUID()
  service_id: string;

  @ApiProperty({
    description: 'Tipo de pago (FULL o EQUAL_SPLIT)',
    format: 'uuid',
    example: 'e2f9b8a1-1234-4cde-9abc-ff1234567890',
  })
  @IsUUID()
  payment_type_id: string;
}
