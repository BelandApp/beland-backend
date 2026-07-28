import { Module } from '@nestjs/common';
import { UserEventPassService } from './user-event-pass.service';
import { UserEventPassController } from './user-event-pass.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEventPass } from './entities/user-event-pass.entity';
import { UserEventPassRepository } from './user-event-pass.repository';
import { NotificationsGateway } from '../notification-socket/notification-socket.gateway';
import { User } from '../users/entities/users.entity';
import { UsersRepository } from '../users/users.repository';
import { WalletsModule } from '../wallets/wallets.module';
import { ConsumeEventPassUseCase } from './use-cases/consume-eventpass.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([UserEventPass, User]), WalletsModule],
  controllers: [UserEventPassController],
  providers: [UserEventPassService, UserEventPassRepository, NotificationsGateway, UsersRepository, ConsumeEventPassUseCase],
})
export class UserEventPassModule {}
