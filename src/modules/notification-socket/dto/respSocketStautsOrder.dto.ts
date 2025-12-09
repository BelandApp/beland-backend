import { ApiProperty } from '@nestjs/swagger';

export class RespSocketStatusOrdersDto {
  @ApiProperty({
    description: 'UUID del estado anterior de la orden.',
  })
  status_old_id: string;

  @ApiProperty({
    description: 'UUID del nuevo estado de la orden.',
  })
  status_new_id: string;

}
