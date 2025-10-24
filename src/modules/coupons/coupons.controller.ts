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
import { CouponsService } from './coupons.service';
import { Coupon } from './entities/coupon.entity';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { ApplyResult } from './interfaces/apply-result.interface';

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
  async create(
    @Req() req: AuthenticatedRequest, // Añadido Req para obtener el ID del creador
    @Body() body: CreateCouponDto,
  ): Promise<Coupon> {
    // Seguridad: Inyectar el ID del usuario creador desde el token de autenticación
    const couponData = { ...body, created_by_user_id: req.user.id };
    return await this.service.create(couponData);
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
  @ApiOperation({
    summary:
      'Aplicar/Redimir un cupón a una compra. Realiza la validación y registra el uso.',
  })
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
    @Body() applyDto: ApplyCouponDto, // Usamos el DTO refactorizado
  ): Promise<ApplyResult> {
    const user_id = req.user.id; // Seguridad: ID del usuario desde el token
    return await this.service.validateAndRedeemCoupon(
      applyDto.coupon_id,
      user_id,
      applyDto.commerce_id,
      applyDto.purchase_total,
      applyDto.order_id,
    );
  }
}
