import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { DeliveryInfoDto } from './dto/create-delivery.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FlexibleAuthGuard } from '../auth/guards/flexible-auth.guard';

@ApiTags('delivery')
@Controller('delivery')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class DeliveryController {
  constructor(private readonly deliveryService: DeliveryService) {}

  @Post('cost')
  async getCost(@Body() dto: DeliveryInfoDto) {
    const { driverLat, driverLon, customerLat, customerLon } = dto;

    const result = await this.deliveryService.getDeliveryInfo(
      { lat: driverLat, lon: driverLon },
      { lat: customerLat, lon: customerLon },
    );

    return {
      ok: true,
      ...result,
    };
  }
}
