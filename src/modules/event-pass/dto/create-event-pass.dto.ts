import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  MaxLength,
} from 'class-validator';

export class CreateEventPassDto {
  // 🪧 DATOS PRINCIPALES
  @ApiProperty({
    example: 'EVT-2025-001',
    description: 'Código único del pase o evento.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  code: string;

  @ApiProperty({
    example: 'Concierto Primavera 2025',
    description: 'Nombre descriptivo del evento o pase.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  name: string;

  @ApiProperty({
    example: 'Un gran evento musical en la ciudad.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://example.com/event-image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  image_url?: string;

  @ApiProperty({
    example: 'https://example.com/background.jpg',
    description: 'Imagen o fondo del evento (opcional).',
    required: false,
  })
  @IsOptional()
  @IsString()
  background_url?: string;

  // 📍 UBICACIÓN DEL EVENTO
  @ApiProperty({
    example: 'Estadio Central',
    description: 'Lugar donde se realiza el evento.',
    required: false,
  })
  @IsOptional()
  @IsString()
  event_place?: string;

  @ApiProperty({
    example: 'Buenos Aires',
    description: 'Ciudad donde se realiza el evento.',
    required: false,
  })
  @IsOptional()
  @IsString()
  event_city?: string;

  // 📅 FECHAS DE CONTROL
  @ApiProperty({
    example: '2025-12-15T20:00:00Z',
    description: 'Fecha y hora del evento.',
  })
  @IsDateString()
  @IsNotEmpty()
  event_date: Date;

  @ApiProperty({
    example: '2025-10-01T00:00:00Z',
    description: 'Fecha de inicio de venta.',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  start_sale_date?: Date;

  @ApiProperty({
    example: '2025-12-10T23:59:59Z',
    description: 'Fecha de finalización de venta.',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  end_sale_date?: Date;

  // 📊 DISPONIBILIDAD
  @ApiProperty({ example: 500, description: 'Límite total de entradas.' })
  @IsNumber()
  limit_tickets: number;

  // 💰 DATOS ECONÓMICOS
  @ApiProperty({
    example: 150.5,
    description: 'Precio en BECOIN del evento.',
  })
  @IsNumber()
  price_becoin: number;

  @ApiProperty({
    example: 10,
    description: 'Descuento aplicado (opcional).',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  // 💸 CONFIGURACIÓN DE DEVOLUCIÓN
  @ApiProperty({
    example: true,
    description: 'Indica si la entrada puede ser devuelta.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_refundable?: boolean;

  @ApiProperty({
    example: 3,
    description: 'Días antes del evento para solicitar reembolso.',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  refund_days_limit?: number;

  // ⭐ FAVORITO
  @ApiProperty({
    example: false,
    description: 'Indica si el evento está marcado como favorito por el usuario.',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_user_favorite?: boolean;

  // ⚙️ ESTADO
  @ApiProperty({
    example: true,
    description: 'Indica si el evento o pase está activo. Por defecto True',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
