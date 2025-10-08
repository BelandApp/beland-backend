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
  ForbiddenException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { PaymentAccountService } from './payment-account.service';
import { PaymentAccount } from './entities/payment-account.entity';
import { Request } from 'express';
import { CreatePaymentAccountDto } from './dto/create-payment-account.dto';
import { UpdatePaymentAccountDto } from './dto/update-payment-account.dto';

@ApiTags('payment-account')
@Controller('payment-account')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class PaymentAccountController {
  constructor(private readonly service: PaymentAccountService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar cuantas de pago con paginación y filtrado por usuario' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiResponse({ status: 200, description: 'Listado de cuantas de pago retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<[PaymentAccount[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAll(pageNumber, limitNumber);
  }

  @Get("user")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar cuantas de pago del usuario logueado con paginación y filtrado por usuario' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiResponse({ status: 200, description: 'Listado de cuantas de pago del usuario retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllUser(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req:Request,
  ): Promise<[PaymentAccount[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAllUser(req.user.id, pageNumber, limitNumber);
  }

  @Get("user-active")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar cuantas activas de pago del usuario logueado con paginación y filtrado por usuario' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiResponse({ status: 200, description: 'Listado de cuantas de pago del usuario retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllUserActive(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req:Request,
  ): Promise<[PaymentAccount[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAllUser(req.user.id, pageNumber, limitNumber, true);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una cuenta de pago por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de la cuenta de pago' })
  @ApiResponse({ status: 200, description: 'Cuenta de pago encontrada' })
  @ApiResponse({ status: 404, description: 'No se encontró la cuenta de pago' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentAccount> {
    return await this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva cuenta de pago' })
  @ApiResponse({ status: 201, description: 'Cuenta de pago creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear la cuenta de pago' })
  @ApiResponse({ status: 500, description: 'No se pudo crear la cuenta de pago' })
  async create(@Body() body: CreatePaymentAccountDto, @Req() req:Request): Promise<PaymentAccount> {
    return await this.service.create({...body, user_id: req.user.id});
  }

  @Put('activate/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una cuenta de pago existente' })
  @ApiParam({ name: 'id', description: 'UUID de la cuenta de pago' })
  @ApiResponse({ status: 200, description: 'Cuenta de pago actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la cuenta de pago a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la cuenta de pago' })
  async activateAccount(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.update(id, {is_active:true});
  }

  @Put('deactivate/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una cuenta de pago existente' })
  @ApiParam({ name: 'id', description: 'UUID de la cuenta de pago' })
  @ApiResponse({ status: 200, description: 'Cuenta de pago actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la cuenta de pago a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la cuenta de pago' })
  async deactivateAccount(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.update(id, {is_active:false});
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una cuenta de pago existente' })
  @ApiParam({ name: 'id', description: 'UUID de la cuenta de pago' })
  @ApiResponse({ status: 200, description: 'Cuenta de pago actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la cuenta de pago a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la cuenta de pago' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdatePaymentAccountDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una cuenta de pago por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de la cuenta de pago' })
  @ApiResponse({ status: 204, description: 'Cuenta de pago eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la cuenta de pago a eliminar' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar la cuenta de pago (conflicto)' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}
