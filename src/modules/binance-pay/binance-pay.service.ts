import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';

@Injectable()
export class BinancePayService {
  private readonly logger = new Logger(BinancePayService.name);
  private readonly baseUrl = process.env.BINANCE_PAY_BASE_URL || 'https://bpay.binanceapi.com';
  private readonly apiKey = process.env.BINANCE_PAY_API_KEY;
  private readonly secret = process.env.BINANCE_PAY_SECRET;

  private genNonce(): string {
    return crypto.randomBytes(16).toString('hex').slice(0, 32);
  }

  // HMAC-SHA512 over: timestamp + "\n" + nonce + "\n" + body + "\n"
  signRequest(timestamp: string, nonce: string, body: any): string {
    const bodyStr = body ? JSON.stringify(body) : '';
    const payload = `${timestamp}\n${nonce}\n${bodyStr}\n`;
    const sig = crypto.createHmac('sha512', this.secret).update(payload).digest('hex').toUpperCase();
    return sig;
  }

  async createOrder(body: any) {
    const timestamp = Date.now().toString();
    const nonce = this.genNonce();
    const signature = this.signRequest(timestamp, nonce, body);

    const headers = {
      'Content-Type': 'application/json',
      'BinancePay-Timestamp': timestamp,
      'BinancePay-Nonce': nonce,
      'BinancePay-Certificate-SN': this.apiKey,
      'BinancePay-Signature': signature,
    };

    const url = `${this.baseUrl}/binancepay/openapi/v3/order`;
    const res = await axios.post(url, body, { headers });
    return res.data;
  }

  // Obtiene certificados públicos (cachear en prod)
  async fetchCertificates() {
    const url = `${this.baseUrl}/binancepay/openapi/certificates`;
    const res = await axios.post(url, {}, { headers: { 'Content-Type': 'application/json' } });
    return res.data?.data || res.data;
  }

  // Verificación RSA-SHA256 (webhook)
  verifyWebhookSignature(certPem: string, timestamp: string, nonce: string, body: string, signatureBase64: string) {
    const payload = `${timestamp}\n${nonce}\n${body}\n`;
    const verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(payload, 'utf8');
    verifier.end();
    const signatureBuffer = Buffer.from(signatureBase64, 'base64');
    try {
      return verifier.verify(certPem, signatureBuffer);
    } catch (err) {
      this.logger.error('Error verifying webhook signature', err);
      return false;
    }
  }
}
