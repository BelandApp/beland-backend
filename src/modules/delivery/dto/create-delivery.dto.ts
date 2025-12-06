import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DeliveryInfoDto {
  @ApiProperty({
    example: -34.6037,
    description: 'Latitud del conductor',
    type: Number,
  })
  @IsNumber()
  driverLat: number;

  @ApiProperty({
    example: -58.3816,
    description: 'Longitud del conductor',
    type: Number,
  })
  @IsNumber()
  driverLon: number;

  @ApiProperty({
    example: -34.6200,
    description: 'Latitud del cliente',
    type: Number,
  })
  @IsNumber()
  customerLat: number;

  @ApiProperty({
    example: -58.4100,
    description: 'Longitud del cliente',
    type: Number,
  })
  @IsNumber()
  customerLon: number;
}
