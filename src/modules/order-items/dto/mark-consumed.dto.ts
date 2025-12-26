// dto/mark-consumed.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsUUID, ArrayNotEmpty } from 'class-validator';

export class MarkConsumedDto {

  @ApiProperty({description:'Array con los id de los items de orden que consumira la persona'})
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  order_item_ids: string[];
}
