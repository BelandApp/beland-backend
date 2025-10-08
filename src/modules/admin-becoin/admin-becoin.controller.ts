import { Controller, Get, Param} from '@nestjs/common';
import { AdminBecoinService } from './admin-becoin.service';

@Controller('admin-becoin')
export class AdminBecoinController {
  constructor(private readonly adminBecoinService: AdminBecoinService) {}

  @Get()
  findAll() {
    return this.adminBecoinService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminBecoinService.findOne(+id);
  }

}
