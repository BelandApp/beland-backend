import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { BecoinCodeService } from './becoin-code.service';
import { ClaimRewardDto } from './dto/claim-reward.dto';

@ApiTags('rewards/claim')
@Controller('rewards')
export class BecoinCodeController {
  constructor(private readonly becoinCodeService: BecoinCodeService) {}

  @Post('claim')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reclamar una recompensa promocional mediante código y email' })
  @ApiResponse({ status: 200, description: 'Recompensa procesada (APPLIED o PENDING)' })
  @ApiResponse({ status: 400, description: 'Código inválido, inactivo o límite alcanzado' })
  @ApiResponse({ status: 409, description: 'El email ya ha reclamado una recompensa' })
  async claimReward(@Body() dto: ClaimRewardDto) {
    return this.becoinCodeService.claimReward(dto);
  }
}
