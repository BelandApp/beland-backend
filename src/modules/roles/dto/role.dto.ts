import { ApiProperty } from '@nestjs/swagger';
import { ValidRoleNames } from '../enum/role-validate.enum';

export class RoleDto {
  @ApiProperty({
    description: 'ID único del rol',
    example: 'uuid',
  })
  role_id: string;

  @ApiProperty({
    description: 'Nombre del rol',
    example: 'USER',
  })
  name: ValidRoleNames;

  @ApiProperty({
    description: 'Descripción del rol',
    example: 'Usuario básico del sistema',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Si el rol está activo',
    example: true,
  })
  is_active: boolean;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-01T00:00:00.000Z',
  })
  created_at: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-01T00:00:00.000Z',
  })
  updated_at: Date;
}
