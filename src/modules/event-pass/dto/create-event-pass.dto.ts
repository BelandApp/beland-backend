import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDate,
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
    description: 'UUID del tipo de evento',
    example: '123ferfe4-34rt-45yt-56yd-345y6gdd.',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  type_id: string;

  // 📍 UBICACIÓN
  @ApiProperty({
    example: 'Estadio Central',
    required: false,
  })
  @IsOptional()
  @IsString()
  event_place?: string;

  @ApiProperty({
    example: 'Buenos Aires',
    required: false,
  })
  @IsOptional()
  @IsString()
  event_city?: string;

  // 📅 FECHAS
  @ApiProperty({
    example: '2025-12-15T20:00:00Z',
    description: 'Fecha y hora del evento.',
  })
  @Type(() => Date)
  @IsDate()
  event_date: Date;

  @ApiProperty({
    example: '2025-10-01T00:00:00Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  start_sale_date?: Date;

  @ApiProperty({
    example: '2025-12-10T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  end_sale_date?: Date;

  // 📊 DISPONIBILIDAD
  @ApiProperty({ example: 500 })
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
    required: false,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  // 💸 DEVOLUCIÓN
  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_refundable?: boolean;

  @ApiProperty({
    example: 3,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  refund_days_limit?: number;

  // ⚙️ ESTADO
  @ApiProperty({
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
