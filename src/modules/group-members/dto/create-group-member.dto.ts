import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateGroupMemberDto {
  @ApiProperty({ description: 'ID del grupo' })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({ description: 'ID del usuario a agregar' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;
}
