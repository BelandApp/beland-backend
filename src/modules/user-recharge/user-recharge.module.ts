import { Module } from '@nestjs/common';
import { UserRechargeService } from './user-recharge.service';
import { UserRechargeController } from './user-recharge.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RechargeTransfer } from './entities/user-recharge.entity';
import { UserRechargeRepository } from './user-recharge.repository';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [TypeOrmModule.forFeature([RechargeTransfer]), EmailModule],
  controllers: [UserRechargeController],
  providers: [UserRechargeService, UserRechargeRepository],
})
export class UserRechargeModule {}
