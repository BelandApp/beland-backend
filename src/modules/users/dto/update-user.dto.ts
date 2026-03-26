import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsBoolean, IsDate } from 'class-validator';
import { RoleEnum, ValidRoleNames } from 'src/modules/roles/enum/role-validate.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Rol del usuario',
    enum: RoleEnum,
    required: false,
  })
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: ValidRoleNames;

  @ApiProperty({
    description: 'Si el usuario está bloqueado',
    example: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @ApiProperty({
    description: 'Fecha de eliminación (soft delete)',
    example: '2024-01-01T00:00:00.000Z',
    required: false,
    nullable: true,
  })
  @IsOptional()
  @IsDate()
  deleted_at?: Date | null;
}
