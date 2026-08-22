import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductLike } from '../products/entities/product-like.entity';
import { ExperiencesService } from './experiences.service'; 
import { ExperiencesController } from './experiences.controller'; 

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductLike])],
  controllers: [ExperiencesController],
  providers: [ExperiencesService],
  exports: [ExperiencesService],
})
export class ExperiencesModule {}
