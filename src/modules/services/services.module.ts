import { Module } from '@nestjs/common';
import { ServiceService } from './services.service';
import { ServiceController } from './services.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './entities/service.entity';
import { ServiceRepository } from './services.repository';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServiceController],
  providers: [ServiceService, ServiceRepository, CloudinaryService],
})
export class ServicesModule {}
