import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Driver } from './entities/driver.entity';
import { DriversController } from './drivers.controller';
import { DriversService } from './drivers.service';
import { DriversRepository } from './drivers.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Driver])],
    controllers: [DriversController],
    providers: [DriversService, DriversRepository],
})
export class DriversModule { }
