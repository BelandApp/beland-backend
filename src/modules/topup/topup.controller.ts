import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TopupService } from './topup.service';
import { CreateTopupDto } from './dto/create-topup.dto';
import { TopupResponseDto } from './dto/topup-response.dto';
import { FlexibleAuthGuard } from '../auth/guards/flexible-auth.guard';

@ApiTags('topup')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
@Controller('topup-binance-pay')
export class TopupController {
  constructor(private readonly topupService: TopupService) {}

  @Post('create')
  @ApiOperation({ summary: 'Crear orden de recarga (USD entero) — retorna checkoutUrl de Binance Pay' })
  @ApiResponse({ status: 201, type: TopupResponseDto })
  async create(@Body() dto: CreateTopupDto) {
    const { walletId, amountUsd } = dto;
    const { topup, binance } = await this.topupService.createTopup(walletId, amountUsd);
    return {
      merchantTradeNo: topup.merchantTradeNo,
      checkoutUrl: topup.checkoutUrl,
      prepayId: topup.prepayId,
      amountUsd: topup.amount_usd,
      currency: topup.currency,
      status: topup.status,
      binanceRaw: binance,
    };
  }
}