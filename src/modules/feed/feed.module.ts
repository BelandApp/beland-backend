import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { Product } from '../products/entities/product.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    JwtModule.register({}), // Requerido para OptionalAuthGuard
  ],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
