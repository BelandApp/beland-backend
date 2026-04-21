import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request, Response } from 'express';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { CreateStripeTopupDto } from './dto/create-stripe-topup.dto';
import { StripeTopupResponseDto } from './dto/stripe-topup-response.dto';
import { StripeTopupStatusDto } from './dto/stripe-topup-status.dto';
import { StripeTopupsService } from './stripe-topups.service';

@ApiTags('stripe-topups')
@Controller()
export class StripeTopupsController {
  constructor(private readonly stripeTopupsService: StripeTopupsService) {}

  @Post('stripe-topups/create-intent')
  @UseGuards(FlexibleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Crea un PaymentIntent de Stripe para recargar la wallet del usuario autenticado',
  })
  @ApiResponse({ status: 201, type: StripeTopupResponseDto })
  async createIntent(
    @Req() req: Request,
    @Body() dto: CreateStripeTopupDto,
  ): Promise<StripeTopupResponseDto> {
    return this.stripeTopupsService.createPaymentIntent(
      req.user.id,
      req.user.email,
      dto,
    );
  }

  @Get('stripe-topups/:id/status')
  @UseGuards(FlexibleAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Consulta el estado de una recarga Stripe del usuario autenticado',
  })
  @ApiResponse({ status: 200, type: StripeTopupStatusDto })
  async getStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: Request,
  ): Promise<StripeTopupStatusDto> {
    return this.stripeTopupsService.getStatus(id, req.user.id);
  }

  @Post('webhooks/stripe')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook de Stripe para confirmar o fallar recargas de wallet',
  })
  async handleWebhook(
    @Headers('stripe-signature') signature: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    await this.stripeTopupsService.handleWebhook(signature, req.body as Buffer);
    res.status(HttpStatus.OK).send('ok');
  }
}
