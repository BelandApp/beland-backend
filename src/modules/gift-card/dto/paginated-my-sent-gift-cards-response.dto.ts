import { ApiProperty } from '@nestjs/swagger';

import { MySentGiftCardResponseDto } from './my-sent-gift-card-response.dto';

export class PaginatedMySentGiftCardsResponseDto {
  @ApiProperty({
    type: () => [MySentGiftCardResponseDto],
  })
  data: MySentGiftCardResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}