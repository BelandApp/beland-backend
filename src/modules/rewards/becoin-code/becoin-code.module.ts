import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RewardCode } from './entities/reward-code.entity';
import { RewardRedemption } from './entities/reward-redemption.entity';
import { BecoinCodeController } from './becoin-code.controller';
import { BecoinCodeService } from './becoin-code.service';
import { BecoinOrangeModule } from '../becoin-orange/becoin-orange.module';
import { User } from '../../users/entities/users.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([RewardCode, RewardRedemption, User]),
    BecoinOrangeModule,
  ],
  controllers: [BecoinCodeController],
  providers: [BecoinCodeService],
  exports: [BecoinCodeService],
})
export class BecoinCodeModule {}
