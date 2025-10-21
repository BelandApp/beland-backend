import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CouponsService, ApplyResult } from './coupons.service'; // Import ApplyResult
import { Coupon } from './entities/coupon.entity';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { User } from 'src/modules/users/entities/users.entity'; // Import User entity

// Fix TS2430: Asegurar que el usuario tiene la estructura correcta
interface AuthenticatedRequest extends Request {
  user: User;
}

@ApiTags('coupons')
@Controller('coupons')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class CouponsController {
  constructor(private readonly service: CouponsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Listar cupones. ADMIN lista todos. COMMERCE lista los que ha creado.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Límite por página',
  })
  async findAll(
    @Req() req: AuthenticatedRequest,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<[Coupon[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // FIX: Usar 'role_name' en lugar de 'role'.
    // Si el usuario es un ADMIN, el user_id se pasa como vacío para listar todos.
    const user_id = req.user.role_name === 'ADMIN' ? '' : req.user.id;

    return await this.service.findAll(user_id, pageNumber, limitNumber);
  }

  // Endpoint para listar cupones disponibles para un comercio específico
  @Get('available/:commerceId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar cupones disponibles para un comercio específico (público)',
  })
  @ApiParam({ name: 'commerceId', description: 'ID del comercio/creador' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número de página',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Límite por página',
  })
  async findAvailableForCommerce(
    @Param('commerceId', ParseUUIDPipe) commerceId: string,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<[Coupon[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAvailableForCommerce(
      commerceId,
      pageNumber,
      limitNumber,
    );
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Buscar un cupón por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del cupón' })
  @ApiResponse({ status: 200, description: 'Cupón encontrado', type: Coupon })
  @ApiResponse({ status: 404, description: 'Cupón no encontrado' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Coupon> {
    return await this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo cupón (requiere rol COMMERCE/ADMIN)',
  })
  @ApiResponse({ status: 201, description: 'Cupón creado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear el cupón',
  })
  @ApiResponse({ status: 500, description: 'No se pudo crear el cupón' })
  async create(@Body() body: CreateCouponDto): Promise<Coupon> {
    return await this.service.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un cupón existente' })
  @ApiParam({ name: 'id', description: 'UUID del cupón' })
  @ApiResponse({ status: 200, description: 'Cupón actualizado correctamente' })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el cupón a actualizar',
  })
  @ApiResponse({ status: 500, description: 'Error al actualizar el cupón' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCouponDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un cupón por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del cupón' })
  @ApiResponse({ status: 204, description: 'Cupón eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'Cupón no encontrado' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.service.remove(id);
  }

  @Post('apply')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Aplicar un cupón a una compra' })
  @ApiResponse({
    status: 200,
    description: 'Cupón aplicado exitosamente',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Cupón no encontrado' })
  @ApiResponse({
    status: 409,
    description:
      'Cupón expirado, ya redimido (límite alcanzado), o no válido para el comercio/monto',
  })
  async applyCoupon(
    @Req() req: AuthenticatedRequest,
    @Body('code') code: string,
    @Body('commerce_id', ParseUUIDPipe) commerce_id: string,
    @Body('current_purchase_amount') current_purchase_amount: number,
    // Se podría incluir el order_id en el DTO o en el body si se registra el uso en este momento
  ): Promise<ApplyResult> {
    const user_id = req.user.id;
    return await this.service.applyCoupon(
      code,
      user_id,
      commerce_id,
      current_purchase_amount,
    );
  }
}
