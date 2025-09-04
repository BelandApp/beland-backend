import { Module } from '@nestjs/common';
import { UserFeedbackService } from './user-feedback.service';
import { UserFeedbackController } from './user-feedback.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserFeedback } from './entities/user-feedback.entity';
import { UserFeedbackRepository } from './user-feedback.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserFeedback])],
  controllers: [UserFeedbackController],
  providers: [UserFeedbackService, UserFeedbackRepository],
})
export class UserFeedbackModule {}
