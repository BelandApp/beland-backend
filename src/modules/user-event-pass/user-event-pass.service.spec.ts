import { Test, TestingModule } from '@nestjs/testing';
import { UserEventPassService } from './user-event-pass.service';

describe('UserEventPassService', () => {
  let service: UserEventPassService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserEventPassService],
    }).compile();

    service = module.get<UserEventPassService>(UserEventPassService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
