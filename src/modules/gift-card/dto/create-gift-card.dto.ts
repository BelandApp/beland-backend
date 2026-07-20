import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateGiftCardDto {
  @ApiProperty({
    example: 'Gift Card Cumpleaños',
    maxLength: 150,
  })
  @IsString()
  @Length(2, 150)
  name: string;

  @ApiPropertyOptional({
    example: 'Gift card especial para cumpleaños.',
  })
  @IsOptional()
  @IsString()
  @Length(0, 5000)
  description?: string;

  @ApiPropertyOptional({
    example: 'https://cdn.myapp.com/giftcards/birthday.jpg',
  })
  @IsOptional()
  @IsUrl()
  @Length(0, 500)
  image_url?: string;

  @ApiProperty({
    example: 25.0,
    description: 'Monto de la gift card',
  })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    example: 'USD',
    default: 'USD',
  })
  @IsOptional()
  @IsString()
  @Length(1, 10)
  currency?: string;

  @ApiPropertyOptional({
    example: 90,
    description: 'Cantidad de días hasta expiración. Null = nunca expira.',
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(3650)
  expiration_days?: number;

  @ApiPropertyOptional({
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}