import { Controller, Post, Body, Headers, Res, Logger } from '@nestjs/common';
import { BinancePayService } from './binance-pay.service';
import { TopupService } from './topup/topup.service';
import { Response } from 'express';

@Controller('webhook/binance')
export class BinanceWebhookController {
  private readonly logger = new Logger(BinanceWebhookController.name);

  constructor(
    private readonly binancePay: BinancePayService,
    private readonly topupService: TopupService,
  ) { }

  @Post()
  async handle(@Body() body: any, @Headers() headers, @Res() res: Response) {
    try {
      const timestamp = headers['binancepay-timestamp'] || headers['Binancepay-Timestamp'];
      const nonce = headers['binancepay-nonce'] || headers['Binancepay-Nonce'];
      const signature = headers['binancepay-signature'] || headers['Binancepay-Signature'];
      const certSn = headers['binancepay-certificate-sn'] || headers['Binancepay-Certificate-SN'];

      if (!timestamp || !nonce || !signature || !certSn) {
        this.logger.warn('Missing required webhook headers');
        return res.status(400).send('MISSING_HEADERS');
      }

      // fetch certs (cache in prod)
      const certs = await this.binancePay.fetchCertificates();
      const found = (certs || []).find((c: any) => c.certSerial === certSn);
      if (!found) {
        this.logger.warn('Certificate serial not found');
        return res.status(400).send('CERT_NOT_FOUND');
      }

      const certPem = found.certPublic;
      const bodyStr = JSON.stringify(body);

      const ok = this.binancePay.verifyWebhookSignature(certPem, timestamp.toString(), nonce.toString(), bodyStr, signature);
      if (!ok) {
        this.logger.warn('Invalid webhook signature');
        return res.status(400).send('INVALID_SIGNATURE');
      }

      // process webhook
      await this.topupService.processWebhook(body);

      // respond SUCCESS to stop reattempts (según doc oficial)
      return res.status(200).send('SUCCESS');
    } catch (err) {
      this.logger.error('Webhook handler error', err);
      return res.status(500).send('ERR');
    }
  }
}
