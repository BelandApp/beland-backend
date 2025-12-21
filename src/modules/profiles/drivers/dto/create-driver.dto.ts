import {
    IsString,
    IsOptional,
    IsBoolean,
    IsUUID,
    IsEnum,
    IsUrl,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleType } from '../enums/vehicle.enum';

export class CreateDriverDto {
    @ApiProperty({
        description: 'ID del usuario asociado al conductor',
        example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ef',
    })
    @IsUUID()
    user_id: string;

    @ApiPropertyOptional({
        description: 'Biografía o motivación del conductor',
        example: 'Trabajo para pagar mis estudios...',
    })
    @IsOptional()
    @IsString()
    motivation_bio?: string;

    @ApiPropertyOptional({
        description: 'Frase de perfil',
        example: 'Siempre rápido y seguro',
    })
    @IsOptional()
    @IsString()
    profile_tagline?: string;

    @ApiPropertyOptional({
        description: 'URL de la foto de perfil del conductor',
        example: 'https://miapp.com/images/driver-face.jpg',
    })
    @IsOptional()
    @IsUrl()
    face_image_url?: string;

    @ApiPropertyOptional({
        description: 'UUID del Tipo de vehículo',
    })
    @IsOptional()
    @IsUUID()
    vehicle_type_id?: string;

    @ApiPropertyOptional({
        description: 'Descripción del vehículo',
        example: 'Honda CB125 Color Roja',
    })
    @IsOptional()
    @IsString()
    vehicle_description?: string;

    @ApiPropertyOptional({
        description: 'Patente o placa del vehículo',
        example: 'ABC-123',
    })
    @IsOptional()
    @IsString()
    vehicle_plate?: string;

    @ApiPropertyOptional({
        description: 'URL de la imagen del vehículo',
        example: 'https://miapp.com/images/vehicle.jpg',
    })
    @IsOptional()
    @IsUrl()
    vehicle_image_url?: string;

    @ApiPropertyOptional({
        description: 'Indica si el conductor está activo',
        default: true,
    })
    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @ApiPropertyOptional({
        description: 'ID de la dirección de trabajo base',
        example: 'b2c3d4e5-f678-90ab-cd12-34567890ef12',
    })
    @IsOptional()
    @IsUUID()
    work_address_id?: string;

    @ApiPropertyOptional({
        description: 'Número de licencia de conducir',
        example: '123456789',
    })
    @IsOptional()
    @IsString()
    license_number?: string;
}
