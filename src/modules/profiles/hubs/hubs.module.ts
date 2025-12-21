import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hub } from './entities/hub.entity';
import { HubsController } from './hubs.controller';
import { HubsService } from './hubs.service';
import { HubsRepository } from './hubs.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Hub])],
  controllers: [HubsController],
  providers: [HubsService, HubsRepository],
})
export class HubsModule {}
