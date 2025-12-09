import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class DeliveryCartDto {    
    
    @ApiProperty({
        description: 'Duracion del delivery en minutos',
        example: '15',
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    duration_min: number;

    @ApiProperty({
        description: 'Distancia que debera recorrer el delivey en kilometros',
        example: '3.5',
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    distance_km: number;

    @ApiProperty({
        description: 'Costo del delivery en dolares',
        example: '3.1',
    })
    @IsNumber({ maxDecimalPlaces: 2 })
    @Type(() => Number)
    delivery_cost: number;
}