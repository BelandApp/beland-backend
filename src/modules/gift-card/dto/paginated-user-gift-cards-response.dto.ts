import { ApiProperty } from '@nestjs/swagger';

import { UserGiftCardResponseDto } from './user-gift-card-response.dto';

export class PaginatedUserGiftCardsResponseDto {
  @ApiProperty({
    type: () => [UserGiftCardResponseDto],
  })
  data: UserGiftCardResponseDto[];

  @ApiProperty({
    example: 125,
  })
  total: number;

  @ApiProperty({
    example: 1,
  })
  page: number;

  @ApiProperty({
    example: 10,
  })
  limit: number;

  @ApiProperty({
    example: 13,
  })
  total_pages: number;
}