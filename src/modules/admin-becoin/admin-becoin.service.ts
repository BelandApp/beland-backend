import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminBecoinService {

  findAll() {
    return `This action returns all adminBecoin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminBecoin`;
  }
}
