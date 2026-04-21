import { ApiProperty } from '@nestjs/swagger';

export class StripeTopupStatusDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  clientTransactionId: string;

  @ApiProperty()
  paymentIntentId: string | null;

  @ApiProperty()
  amountUsd: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  becoinsGranted: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  completedAt: Date | null;

  @ApiProperty()
  failureCode: string | null;

  @ApiProperty()
  failureMessage: string | null;
}
