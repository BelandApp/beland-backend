import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsUUID, IsNotEmpty, IsDate } from 'class-validator';
import { Group } from 'src/modules/groups/entities/group.entity';
import { User } from 'src/modules/users/entities/users.entity';
import { RoleGoupEnum, RoleGroupNames } from '../enums/role-group.enum';

export class GroupMemberDto {
    @ApiProperty({ description: 'ID de la membresía' })
    @IsUUID()
    id: string;

    @ApiProperty({ description: 'Rol del usuario en el grupo', enum: RoleGoupEnum })
    @IsEnum(RoleGoupEnum)
    role: RoleGroupNames;

    @ApiProperty({ description: 'Grupo al que pertenece' })
    group: Group;

    @ApiProperty({ description: 'Usuario miembro' })
    user: User;

    @ApiProperty({ description: 'Fecha de creación' })
    @IsDate()
    created_at: Date;

    @ApiProperty({ description: 'Fecha de actualización' })
    @IsDate()
    updated_at: Date;
}
