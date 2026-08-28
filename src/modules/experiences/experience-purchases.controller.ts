import { Controller, Post, Body, HttpCode, HttpStatus, Patch, Param, ParseUUIDPipe, UseGuards, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ExperiencePurchasesService } from './experience-purchases.service';
import { CreateExperiencePurchaseDto } from './dto/create-experience-purchase.dto';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';
import { Roles } from 'src/modules/auth/decorators/roles.decorator';

@ApiTags('experiences-purchases')
@Controller('experiences/purchases')
export class ExperiencePurchasesController {
  constructor(private readonly purchasesService: ExperiencePurchasesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar una compra o reserva de Experiences' })
  @ApiResponse({ status: 201, description: 'Operación registrada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos o el monto total no coincide con los productos' })
  async create(@Body() dto: CreateExperiencePurchaseDto) {
    const purchase = await this.purchasesService.createPurchase(dto);
    
    return {
      purchase_id: purchase.id,
      status: purchase.status,
      is_reserved: purchase.is_reserved,
      orange_reward_amount: purchase.orange_reward_amount,
    };
  }

  @Patch(':id/status/paid')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FlexibleAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Cambiar el estado de una reserva a PAGADO' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 400, description: 'Transición inválida o reserva ya procesada' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async markAsPaid(@Param('id', ParseUUIDPipe) id: string) {
    const purchase = await this.purchasesService.updateStatusToPaid(id);
    return {
      purchase_id: purchase.id,
      status: purchase.status,
      orange_reward_amount: purchase.orange_reward_amount,
    };
  }

  @Patch(':id/status/delivered')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FlexibleAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Cambiar el estado de una compra o reserva a ENTREGADO' })
  @ApiResponse({ status: 200, description: 'Estado actualizado' })
  @ApiResponse({ status: 400, description: 'Transición inválida' })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({ status: 403, description: 'No autorizado.' })
  async markAsDelivered(@Param('id', ParseUUIDPipe) id: string) {
    const purchase = await this.purchasesService.updateStatusToDelivered(id);
    return {
      purchase_id: purchase.id,
      status: purchase.status,
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @UseGuards(FlexibleAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Listar todas las compras de Experiences (Solo Admin/Superadmin)' })
  @ApiResponse({ status: 200, description: 'Lista de compras' })
  async findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.purchasesService.findAll(pageNum, limitNum);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @UseGuards(FlexibleAuthGuard, RolesGuard)
  @Roles('ADMIN', 'SUPERADMIN')
  @ApiOperation({ summary: 'Obtener detalle de una compra por ID (Solo Admin/Superadmin)' })
  @ApiResponse({ status: 200, description: 'Detalle de la compra' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.purchasesService.findOne(id);
  }
}
