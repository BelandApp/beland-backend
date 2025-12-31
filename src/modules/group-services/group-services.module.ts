import { Module } from '@nestjs/common';
import { GroupServicesService } from './group-services.service';
import { GroupServicesController } from './group-services.controller';
import typeormCliConfig from 'src/database/typeorm-cli.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupService } from './entities/group-service.entity';
import { GroupServicesRepository } from './group-services.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupService])],
  controllers: [GroupServicesController],
  providers: [GroupServicesService, GroupServicesRepository],
})
export class GroupServicesModule {}
