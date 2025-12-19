import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { RoleGoupEnum, RoleGroupNames } from '../enums/role-group.enum';

export class CreateGroupMemberDto {
  @ApiProperty({ description: 'ID del grupo' })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({ description: 'ID del usuario a agregar' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ description: 'Rol del usuario en el grupo', enum: RoleGoupEnum, required: false, default: RoleGoupEnum.MEMBER })
  @IsOptional()
  @IsEnum(RoleGoupEnum)
  role?: RoleGroupNames;
}
