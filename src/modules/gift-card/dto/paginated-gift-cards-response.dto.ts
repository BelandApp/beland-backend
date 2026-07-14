import { ApiProperty } from '@nestjs/swagger';

import { GiftCardResponseDto } from './gift-card-response.dto';

export class PaginatedGiftCardsResponseDto {
  @ApiProperty({
    type: [GiftCardResponseDto],
  })
  data: GiftCardResponseDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  total_pages: number;
}