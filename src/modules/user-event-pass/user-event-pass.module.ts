import { Module } from '@nestjs/common';
import { UserEventPassService } from './user-event-pass.service';
import { UserEventPassController } from './user-event-pass.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEventPass } from './entities/user-event-pass.entity';
import { UserEventPassRepository } from './user-event-pass.repository';
import { NotificationsGateway } from '../notification-socket/notification-socket.gateway';
import { User } from '../users/entities/users.entity';
import { UsersRepository } from '../users/users.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserEventPass, User])],
  controllers: [UserEventPassController],
  providers: [UserEventPassService, UserEventPassRepository, NotificationsGateway, UsersRepository],
})
export class UserEventPassModule {}
