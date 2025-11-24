import { ApiProperty } from '@nestjs/swagger';

export class TopupResponseDto {
  @ApiProperty() merchantTradeNo: string;
  @ApiProperty() checkoutUrl: string;
  @ApiProperty() prepayId: string;
  @ApiProperty() amountUsd: number;
  @ApiProperty() currency: string;
}
