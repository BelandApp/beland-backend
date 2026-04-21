import { ApiProperty } from '@nestjs/swagger';

export class StripeTopupResponseDto {
  @ApiProperty()
  topupId: string;

  @ApiProperty()
  clientTransactionId: string;

  @ApiProperty()
  paymentIntentId: string;

  @ApiProperty()
  clientSecret: string;

  @ApiProperty()
  amountUsd: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  status: string;
}
