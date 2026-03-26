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
    example: 'USER',
    enum: RoleEnum,
  })
  @IsString()
  @IsNotEmpty()
  @IsEnum(RoleEnum)
  name: ValidRoleNames;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Usuario básico del sistema',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    description: 'Si el rol está activo',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
