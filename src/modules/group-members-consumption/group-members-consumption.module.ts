import { Module } from '@nestjs/common';
import { GroupMemberConsumptionsController } from './group-members-consumption.controller';
import { GroupMemberConsumptionsService } from './group-members-consumption.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupMemberConsumption } from './entities/group-members-consumption.entity';
import { GroupMemberConsumptionsRepository } from './group-members-consumption.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupMemberConsumption])],
  controllers: [GroupMemberConsumptionsController],
  providers: [GroupMemberConsumptionsService, GroupMemberConsumptionsRepository],
})
export class GroupMembersConsumptionModule {}
