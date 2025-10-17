import { ApiProperty } from '@nestjs/swagger';

export class RespSocketEventpassDto {
  @ApiProperty({
    example: 'EVT-2025-001',
    description: 'Código único del pase o evento.',
  })
  code: string;

  @ApiProperty({
    example: 'Concierto Primavera 2025',
    description: 'Nombre descriptivo del evento o pase.',
  })
  name: string;

  @ApiProperty({
    example: 120,
    description: 'Cantidad total de entradas disponibles para el evento.',
  })
  limit_tickets: number;

  @ApiProperty({
    example: 120,
    description: 'Cantidad total de entradas vendidas para el evento.',
  })
  sold_tickets: number;

  @ApiProperty({
    example: 95,
    description: 'Cantidad total de asistentes que ya usaron su entrada.',
  })
  attended_count: number;

  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre del usuario que utilizó la entrada.',
  })
  user_name: string;

  @ApiProperty({
    example: '1165785432',
    description: 'Telefono de contacto del usuario.',
  })
  user_phone: string;

  @ApiProperty({
    example: '12345678',
    description: 'Documento o identificación del usuario.',
  })
  user_document: string;
}
