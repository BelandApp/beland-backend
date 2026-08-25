import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entities/product.entity';

import { ExperiencePurchase } from './entities/experience-purchase.entity';
import { ExperiencePurchaseItem } from './entities/experience-purchase-item.entity';
import { ExperiencesService } from './experiences.service'; 
import { ExperiencesController } from './experiences.controller'; 
import { ExperiencePurchasesService } from './experience-purchases.service';
import { ExperiencePurchasesController } from './experience-purchases.controller';
import { ProductMedia } from '../products/entities/product-media.entity';
import { SuperadminModule } from '../superadmin-config/superadmin-config.module';
import { ProcessPendingPurchasesUseCase } from './use-cases/process-pending-purchases.use-case';
import { BecoinOrangeModule } from '../rewards/becoin-orange/becoin-orange.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, ExperiencePurchase, ExperiencePurchaseItem, ProductMedia]),
    SuperadminModule,
    BecoinOrangeModule,
  ],
  controllers: [ExperiencesController, ExperiencePurchasesController],
  providers: [ExperiencesService, ExperiencePurchasesService, ProcessPendingPurchasesUseCase],
  exports: [ExperiencesService, ExperiencePurchasesService, ProcessPendingPurchasesUseCase],
})
export class ExperiencesModule {}
