import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatorsController } from './creators.controller';
import { CreatorsService } from './creators.service';
import { CreatorsRepository } from './creators.repository';
import { Creator } from './entities/creator.entity';
import { SocialNetwork } from './entities/social-network.entity';
import { ContentCategory } from './entities/content-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Creator,
      SocialNetwork,
      ContentCategory,
    ]),
  ],
  controllers: [CreatorsController],
  providers: [CreatorsService, CreatorsRepository],
  exports: [CreatorsService],
})
export class CreatorsModule {}
