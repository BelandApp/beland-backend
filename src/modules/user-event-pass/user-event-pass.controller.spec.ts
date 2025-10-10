import { Test, TestingModule } from '@nestjs/testing';
import { UserEventPassController } from './user-event-pass.controller';
import { UserEventPassService } from './user-event-pass.service';

describe('UserEventPassController', () => {
  let controller: UserEventPassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserEventPassController],
      providers: [UserEventPassService],
    }).compile();

    controller = module.get<UserEventPassController>(UserEventPassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
