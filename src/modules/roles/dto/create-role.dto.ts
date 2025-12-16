import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { RoleEnum, ValidRoleNames } from '../enum/role-validate.enum';

export class CreateRoleDto {
  @ApiProperty({
    description: 'Nombre del rol',
    // ¡ACTUALIZADO para incluir EMPRESA en el ejemplo y enum!
    example: 'USER', // USER, LEADER, ADMIN, SUPERADMIN, COMMERCE, FUNDATION
    enum: RoleEnum,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(RoleEnum) // Asegurarse de que el valor sea uno de los roles válidos
  name: ValidRoleNames; // Tipo literal para el nombre del rol

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Usuario básico del sistema',
    required: false,
    nullable: true, // Añadido nullable para coincidir con la entidad
  })
  @IsOptional()
  @IsString()
  description?: string | null; // Cambiado a string | null

  @ApiProperty({
    description: 'Si el rol está activo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
