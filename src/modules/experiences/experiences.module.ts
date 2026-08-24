import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';
import { ProductLike } from '../products/entities/product-like.entity';
import { ExperiencePurchase } from './entities/experience-purchase.entity';
import { ExperiencePurchaseItem } from './entities/experience-purchase-item.entity';
import { ExperiencesService } from './experiences.service'; 
import { ExperiencesController } from './experiences.controller'; 
import { ExperiencePurchasesService } from './experience-purchases.service';
import { ExperiencePurchasesController } from './experience-purchases.controller';
import { ProductMedia } from '../products/entities/product-media.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductLike, ExperiencePurchase, ExperiencePurchaseItem, ProductMedia])],
  controllers: [ExperiencesController, ExperiencePurchasesController],
  providers: [ExperiencesService, ExperiencePurchasesService],
  exports: [ExperiencesService],
})
export class ExperiencesModule {}
