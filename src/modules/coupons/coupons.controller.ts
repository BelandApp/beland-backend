import {
  Controller,
  ForbiddenException,
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
import { CouponsService } from './coupons.service';
import { Coupon } from './entities/coupon.entity';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { ApplyResult } from './interfaces/apply-result.interface';
import {
  ADMIN_AUTHORITY_ROLES,
  RoleEnum,
} from 'src/modules/roles/enum/role-validate.enum';
import { ProfileEnum } from 'src/modules/users/enums/profiles.enum';

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
      'Listar cupones. ADMIN lista todos. El resto ve los que ha creado.',
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
    @Req() req: Request,
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ): Promise<[Coupon[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    const user_id = ADMIN_AUTHORITY_ROLES.includes(req.user.role_name)
      ? ''
      : req.user.id;

    return await this.service.findAll(user_id, pageNumber, limitNumber);
  }

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
    summary:
      'Crear un nuevo cupón (requiere perfil MERCHANT o rol ADMIN/SUPERADMIN)',
  })
  @ApiResponse({ status: 201, description: 'Cupón creado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear el cupón',
  })
  @ApiResponse({ status: 500, description: 'No se pudo crear el cupón' })
  async create(
    @Req() req: Request,
    @Body() body: CreateCouponDto,
  ): Promise<Coupon> {
    const hasMerchantProfile = req.user.profiles?.includes(ProfileEnum.MERCHANT);
    const isAdmin = ADMIN_AUTHORITY_ROLES.includes(req.user.role_name);

    if (!hasMerchantProfile && !isAdmin) {
      throw new ForbiddenException('No tienes permisos para crear cupones.');
    }

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
      'Cupón expirado, ya redimido, o no válido para el comercio/monto',
  })
  async applyCoupon(
    @Req() req: Request,
    @Body() applyDto: ApplyCouponDto,
  ): Promise<ApplyResult> {
    const user_id = req.user.id;
    return await this.service.validateAndRedeemCoupon(
      applyDto.coupon_id,
      user_id,
      applyDto.commerce_id,
      applyDto.purchase_total,
      applyDto.order_id,
    );
  }
}
