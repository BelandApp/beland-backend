import { Module } from '@nestjs/common';
import { GenerateOrangeRewardUseCase } from './use-cases/generate-orange-reward.use-case';
import { SpendOrangeUseCase } from './use-cases/spend-orange.use-case';
import { RefundOrangeUseCase } from './use-cases/refund-orange.use-case';
import { RevokeOrangeUseCase } from './use-cases/revoke-orange.use-case';

@Module({
  providers: [
    GenerateOrangeRewardUseCase,
    SpendOrangeUseCase,
    RefundOrangeUseCase,
    RevokeOrangeUseCase,
  ],
  exports: [
    GenerateOrangeRewardUseCase,
    SpendOrangeUseCase,
    RefundOrangeUseCase,
    RevokeOrangeUseCase,
  ],
})
export class BecoinOrangeModule {}
