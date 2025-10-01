// notifications.module.ts
import { Module } from '@nestjs/common';
import { NotificationsGateway } from './notification-socket.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/modules/users/entities/users.entity';
import { UsersRepository } from 'src/modules/users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [NotificationsGateway, UsersRepository],
  exports: [NotificationsGateway], // <- para inyectarlo en otros servicios
})
export class NotificationsSocketModule {}