import { Module } from '@nestjs/common';
import { EventPassService } from './event-pass.service';
import { EventPassController } from './event-pass.controller';
import { CloudinaryService } from 'src/modules/cloudinary/cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventPass } from './entities/event-pass.entity';
import { EventPassRepository } from './event-pass.repository';
import { SuperadminConfigService } from '../superadmin-config/superadmin-config.service';

@Module({
  imports: [TypeOrmModule.forFeature([EventPass])],
  controllers: [EventPassController],
  providers: [EventPassService, CloudinaryService, EventPassRepository],
})
export class EventPassModule {}
