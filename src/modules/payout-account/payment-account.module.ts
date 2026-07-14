import { Module } from '@nestjs/common';
import { PaymentAccountService } from './payment-account.service';
import { PaymentAccountController } from './payment-account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentAccount } from './entities/payment-account.entity';
import { PaymentAccountRepository } from './payment-account.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentAccount])],
  controllers: [PaymentAccountController],
  providers: [PaymentAccountService, PaymentAccountRepository],
})
export class PaymentAccountModule {}
