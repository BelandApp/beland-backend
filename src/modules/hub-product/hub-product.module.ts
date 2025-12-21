import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HubProduct } from './entities/hub-product.entity';
import { HubProductsController } from './hub-product.controller';
import { HubProductsService } from './hub-product.service';
import { HubProductsRepository } from './hub-product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([HubProduct]),
  ],
  controllers: [HubProductsController],
  providers: [HubProductsService, HubProductsRepository],
  exports: [HubProductsService],
})
export class HubProductsModule {}
