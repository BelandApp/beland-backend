import {
  Controller,
  Get,
  Post,
  Body,
  Param,
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
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Request } from 'express';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';

@ApiTags('orders')
@Controller('orders')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class OrdersController {
  constructor(private readonly service: OrdersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar ordenes con paginación y filtrado '})
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiResponse({ status: 200, description: 'Listado de ordenes retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<[Order[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAll(pageNumber, limitNumber);
  }

  @Get('pending')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar ordenes con paginación y filtrado por estado "PENDING" del mas antiguo al mas nuevo' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiResponse({ status: 200, description: 'Listado de ordenes retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllPending(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<[Order[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAllPending(pageNumber, limitNumber);
  }
  
  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar ordenes con paginación y filtrado por usuario registrado' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiResponse({ status: 200, description: 'Listado de ordenes retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllUser(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req: Request,
  ): Promise<[Order[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAllUser(req.user.id, pageNumber, limitNumber);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una orden por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de la orden' })
  @ApiResponse({ status: 200, description: 'Orden encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró la orden' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Order> {
    return await this.service.findOne(id);
  }

  @Put('preparing')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cambiar el estado de la orden a En Preparacion' })
  @ApiQuery({ name: 'order_id', required: true, description: 'UUID de la orden' })
  @ApiResponse({ status: 201, description: 'Actualizacion exitosa' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para la confirmacion' })
  @ApiResponse({ status: 500, description: 'No se pudo realizar la confirmacion' })
  async preparing(@Query('order_id', ParseUUIDPipe) order_id:string): Promise<Order> {
    return await this.service.preparing(order_id);
  }

  @Put('on-route')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cambiar el estado de la orden a En Camino' })
  @ApiQuery({ name: 'order_id', required: true, description: 'UUID de la orden' })
  @ApiResponse({ status: 201, description: 'Confirmacion de recibo exitosa' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para la confirmacion' })
  @ApiResponse({ status: 500, description: 'No se pudo realizar la confirmacion' })
  async onRoute(@Query('order_id', ParseUUIDPipe) order_id:string): Promise<Order> {
    return await this.service.onRoute(order_id);
  }

  @Put('delivered')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirma Entrega de la orden por admin' })
  @ApiQuery({ name: 'order_id', required: true, description: 'UUID de la orden' })
  @ApiQuery({ name: 'code', required: true, description: 'Codigo de orden dado por el usuario, debe cohincidir con el de la orden' })
  @ApiResponse({ status: 201, description: 'Confirmacion de entrega exitosa' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para la confirmacion' })
  @ApiResponse({ status: 500, description: 'No se pudo realizar la confirmacion' })
  async delivered(
    @Query('order_id', ParseUUIDPipe) order_id:string,
    @Query('code') code:number,
   ): Promise<Order> {
    return await this.service.delivered(order_id, code);
  }

  @Put('cancelled')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancelacion de la orden' })
  @ApiQuery({ name: 'order_id', required: true, description: 'UUID de la orden' })
  @ApiQuery({ name: 'observation', required: true, description: 'Respuesta del porque se canceló la orden' })
  @ApiResponse({ status: 201, description: 'Cancelacion exitosa' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para la confirmacion' })
  @ApiResponse({ status: 500, description: 'No se pudo realizar la confirmacion' })
  async cancelled(
    @Query('order_id', ParseUUIDPipe) order_id:string,
    @Query('observation') observation:string,
  ): Promise<Order> {
    return await this.service.cancelled(order_id, observation);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden' })
  @ApiResponse({ status: 201, description: 'Orden creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear la orden' })
  @ApiResponse({ status: 500, description: 'No se pudo crear la orden' })
  async create(@Body() body: CreateOrderDto): Promise<Order> {
    return await this.service.create(body);
  }

  @Post('cart')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva orden desde un carrito' })
  @ApiQuery({ name: 'cart_id', required: true, type: String, description: 'UUID del carrito sobre el cual se genera la orden de compra' })
  @ApiResponse({ status: 201, description: 'Orden creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear la orden' })
  @ApiResponse({ status: 500, description: 'No se pudo crear la orden' })
  async createOrderByCart(
    @Query('cart_id', ParseUUIDPipe) cart_id: string,
    @Req() req : Request,
  ): Promise<Order> {
  const user_id = req.user.id;
  return await this.service.createOrderByCart(cart_id, user_id);
  }

}
