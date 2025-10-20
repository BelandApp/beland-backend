import { Module } from '@nestjs/common';
import { UserEventPassService } from './user-event-pass.service';
import { UserEventPassController } from './user-event-pass.controller';

@Module({
  controllers: [UserEventPassController],
  providers: [UserEventPassService],
})
export class UserEventPassModule {}
