import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExperiencePurchasesService } from './experience-purchases.service';
import { CreateExperiencePurchaseDto } from './dto/create-experience-purchase.dto';

@ApiTags('experiences-purchases')
@Controller('experiences/purchases')
export class ExperiencePurchasesController {
  constructor(private readonly purchasesService: ExperiencePurchasesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar una compra Guest de Experiences pagada con Payphone' })
  @ApiResponse({ status: 201, description: 'Compra registrada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o el monto total no coincide con los productos' })
  async create(@Body() dto: CreateExperiencePurchaseDto) {
    const purchase = await this.purchasesService.createPurchase(dto);
    
    // Retornamos solo la info necesaria según requerimientos
    return {
      id: purchase.id,
      status: purchase.status,
      total_amount: purchase.total_amount,
      currency: purchase.currency,
    };
  }
}
