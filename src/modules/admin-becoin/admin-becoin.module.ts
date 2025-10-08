import { Module } from '@nestjs/common';
import { AdminBecoinService } from './admin-becoin.service';
import { AdminBecoinController } from './admin-becoin.controller';

@Module({
  controllers: [AdminBecoinController],
  providers: [AdminBecoinService],
})
export class AdminBecoinModule {}
