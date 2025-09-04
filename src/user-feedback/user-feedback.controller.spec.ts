import { Test, TestingModule } from '@nestjs/testing';
import { UserFeedbackController } from './user-feedback.controller';
import { UserFeedbackService } from './user-feedback.service';

describe('UserFeedbackController', () => {
  let controller: UserFeedbackController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserFeedbackController],
      providers: [UserFeedbackService],
    }).compile();

    controller = module.get<UserFeedbackController>(UserFeedbackController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
