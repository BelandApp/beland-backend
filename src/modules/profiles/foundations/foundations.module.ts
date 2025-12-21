import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundationsService } from './foundations.service';
import { FoundationsController } from './foundations.controller';
import { FoundationsRepository } from './foundations.repository';
import { Foundation } from './entities/foundation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Foundation])],
  controllers: [FoundationsController],
  providers: [FoundationsService, FoundationsRepository],
})
export class FoundationsModule {}
