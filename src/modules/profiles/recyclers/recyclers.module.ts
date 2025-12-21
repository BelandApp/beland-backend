import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecyclersService } from './recyclers.service';
import { RecyclersController } from './recyclers.controller';
import { RecyclersRepository } from './recyclers.repository';
import { RecyclerBase } from './entities/recycler.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecyclerBase])],
  controllers: [RecyclersController],
  providers: [RecyclersService, RecyclersRepository],
})
export class RecyclersModule {}
