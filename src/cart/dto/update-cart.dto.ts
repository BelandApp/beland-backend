import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
    @ApiPropertyOptional({
    description: 'ID de la direccion asociado al carrito',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    })
    @IsUUID()
    @IsOptional()
    address_id?: string;

@ApiPropertyOptional({
    description: 'ID del tipo de pago asociado al carrito',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    })
    @IsUUID()
    @IsOptional()
    payment_type_id: string;

    @ApiPropertyOptional({
    description: 'ID del grupo asociado al carrito',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
    })
    @IsUUID()
    @IsOptional()
    group_id: string;
}
