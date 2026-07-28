import { Module } from '@nestjs/common';
import { UserWithdrawsService } from './user-withdraw.service';
import { UserWithdrawsController } from './user-withdraw.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserWithdraw } from './entities/user-withdraw.entity';
import { UserWithdrawsRepository } from './user-withdraw.repository';
import { EmailModule } from '../email/email.module';
import { CreateWithdrawRequestUseCase } from './use-cases/create-withdraw-request.use-case';
import { CompleteWithdrawUseCase } from './use-cases/complete-withdraw.use-case';
import { FailWithdrawUseCase } from './use-cases/fail-withdraw.use-case';

import { WalletsModule } from '../wallets/wallets.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserWithdraw]), EmailModule, WalletsModule],
  controllers: [UserWithdrawsController],
  providers: [
    UserWithdrawsService,
    UserWithdrawsRepository,
    CreateWithdrawRequestUseCase,
    CompleteWithdrawUseCase,
    FailWithdrawUseCase,
  ],
})
export class UserWithdrawModule {}
