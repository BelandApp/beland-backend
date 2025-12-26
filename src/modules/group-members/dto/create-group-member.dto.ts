import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsNotEmpty, IsArray, ArrayNotEmpty } from 'class-validator';

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

export class CreateManyGroupMemberDto {
  @ApiProperty({ description: 'ID del grupo' })
  @IsUUID()
  @IsNotEmpty()
  group_id: string;

  @ApiProperty({
    description: 'Array de IDs de usuarios',
    type: [String],
    format: 'uuid',
    example: [
      '550e8400-e29b-41d4-a716-446655440000',
      '550e8400-e29b-41d4-a716-446655440001',
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  users: string[];
}

