import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  IsInt,
  Min,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsDateString,
  IsDate,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateEventPassDto {
  // 🪧 DATOS PRINCIPALES
  @ApiProperty({ example: 'EVT-2025-001', description: 'Código único del evento' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiProperty({ example: 'Concierto de Verano', description: 'Nombre del evento' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Un concierto al aire libre con artistas locales.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/images/concierto.jpg' })
  @IsUrl()
  @IsOptional()
  image_url?: string;

  // 📅 FECHAS DE CONTROL
  @ApiProperty({ example: '2025-12-15T20:00:00Z' })
  @IsDate()
  @Type(() => Date)
  event_date: Date;

  @ApiPropertyOptional({ example: '2025-11-01T00:00:00Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  start_date?: Date;

  @ApiPropertyOptional({ example: '2025-12-14T23:59:59Z' })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  end_date?: Date;

  // 📊 DATOS DE DISPONIBILIDAD Y CONTROL
  @ApiProperty({ example: 100, description: 'Cantidad total de entradas disponibles' })
  @IsInt()
  @Min(1)
  limit_tickets: number;

  @ApiPropertyOptional({ example: 0, description: 'Entradas vendidas inicialmente' })
  @IsInt()
  @Min(0)
  @IsOptional()
  sold_tickets?: number;

  @ApiPropertyOptional({ example: true, description: 'Disponibilidad del evento' })
  @IsBoolean()
  @IsOptional()
  available?: boolean;

  // 💰 DATOS ECONÓMICOS
  @ApiProperty({ example: 500, description: 'Precio base en becoins' })
  @IsNumber()
  @Min(0)
  price_becoin: number;

  @ApiPropertyOptional({ example: 50, description: 'Descuento en becoins' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  discount?: number;

  @ApiProperty({ example: 450, description: 'Precio final en becoins (precio - descuento)' })
  @IsNumber()
  @Min(0)
  total_becoin: number;

  // ⚙️ ESTADO
  @ApiPropertyOptional({ example: true, description: 'Indica si el evento está activo' })
  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}
