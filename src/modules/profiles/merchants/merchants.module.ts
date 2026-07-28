import { Module } from '@nestjs/common';
import { MerchantsService } from './merchants.service';
import { MerchantsController } from './merchants.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchant } from './entities/merchant.entity';
import { MerchantsRepository } from './merchants.repository';
import { WalletsModule } from 'src/modules/wallets/wallets.module';

@Module({
  imports: [TypeOrmModule.forFeature([Merchant]), WalletsModule],
  controllers: [MerchantsController],
  providers: [MerchantsService, MerchantsRepository],
})
export class MerchantsModule {}
