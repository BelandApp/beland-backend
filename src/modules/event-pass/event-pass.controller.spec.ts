import { Test, TestingModule } from '@nestjs/testing';
import { EventPassController } from './event-pass.controller';
import { EventPassService } from './event-pass.service';

describe('EventPassController', () => {
  let controller: EventPassController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventPassController],
      providers: [EventPassService],
    }).compile();

    controller = module.get<EventPassController>(EventPassController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
