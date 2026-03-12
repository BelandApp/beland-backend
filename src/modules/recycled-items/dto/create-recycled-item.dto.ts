// src/recycled-items/dto/create-recycled-item.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsUUID } from 'class-validator';

export class CreateRecycledItemDto {
  @ApiProperty({ description: 'Peso del reciclado' })
  @IsNumber()
  weight: number;

  @ApiProperty({ description: 'ID del usuario que reciclo' })
  @IsUUID()
  user_id: string;
}
