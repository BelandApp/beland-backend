import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { RoleGoupEnum } from '../enums/role-group.enum';

export class UpdateGroupMemberDto {
    @ApiProperty({ description: 'Nuevo rol del usuario en el grupo', enum: RoleGoupEnum })
    @IsNotEmpty()
    @IsEnum(RoleGoupEnum)
    role: RoleGoupEnum;
}
