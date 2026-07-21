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
import { PaymentsService } from './payments.service';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PayphoneOrderDto } from './dto/payphone-order.dto';
import { TransferOrderDto } from './dto/transfer-order.dto';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { Request } from 'express';

@ApiTags('payments')
@Controller('payments')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar pagos con paginación y filtro exclusivo' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiQuery({ name: 'order_id', required: false, type: String, description: 'Filtrar por ID de orden. No usar junto con user_id.' })
  @ApiResponse({ status: 200, description: 'Listado de pagos retornado correctamente' })
  @ApiResponse({ status: 400, description: 'Solo puede enviarse user_id o group_id, no ambos.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req: Request,
    @Query('order_id') order_id = '',
  ): Promise<[Payment[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAll(order_id, req.user.id, pageNumber, limitNumber);
  }

  @Get("order/:order_id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar pagos con paginación y filtro exclusivo de una orden' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiQuery({ name: 'uncompleted', required: false, type: Boolean, example: true, description: 'Si es true (valor por defecto), solo pagos incompletos, si es false, todos los pagos de la orden' })
  @ApiParam({ name: 'order_id', required: true, type: String, description: 'Filtrar por ID de orden.' })
  @ApiResponse({ status: 200, description: 'Listado de pagos retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findPaymentsByOrder(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('uncompleted') uncompleted:boolean = true,
    @Req() req: Request,
    @Param('order_id') order_id: string,
  ): Promise<[Payment[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findPaymentsByOrder(order_id, req.user.id, uncompleted, pageNumber, limitNumber);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un pago por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del pago' })
  @ApiResponse({ status: 200, description: 'Pago encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró el pago' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Payment> {
    return await this.service.findOne(id);
  }

  @Post('pay-now/:payment_id')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'payment_id', description: 'UUID del pago a realizar' })
  @ApiOperation({ summary: 'Crear un nuevo pago' })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el pago' })
  @ApiResponse({ status: 500, description: 'Error al crear el miembro' })
  async payNow(
    @Param('payment_id', ParseUUIDPipe) payment_id: string,
    @Body('userGiftCardId', new ParseUUIDPipe({ optional: true })) userGiftCardId?: string,
  ): Promise<{payment: Payment, message:string, becoinOrangeUsed:number}> {
    return await this.service.payNow(payment_id, userGiftCardId);
  }

  @Post('payphone/:payment_id')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'payment_id', description: 'UUID del pago a realizar' })
  @ApiOperation({ summary: 'Realizar pago de orden mediante Payphone' })
  @ApiResponse({ status: 201, description: 'Pago de orden procesado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Pago u Orden no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto con la transacción' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async payWithPayphone(
    @Param('payment_id', ParseUUIDPipe) payment_id: string,
    @Body() dto: PayphoneOrderDto,
  ) {
    return await this.service.payWithPayphone(payment_id, dto);
  }

  @Post('transfer/:payment_id')
  @HttpCode(HttpStatus.CREATED)
  @ApiParam({ name: 'payment_id', description: 'UUID del pago a realizar' })
  @ApiOperation({ summary: 'Realizar pago de orden mediante Transferencia Bancaria' })
  @ApiResponse({ status: 201, description: 'Pago de orden procesado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 404, description: 'Pago u Orden no encontrado' })
  @ApiResponse({ status: 409, description: 'Conflicto con la transacción' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async payWithTransfer(
    @Param('payment_id', ParseUUIDPipe) payment_id: string,
    @Body() dto: TransferOrderDto,
  ) {
    return await this.service.payWithTransfer(payment_id, dto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo pago' })
  @ApiResponse({ status: 201, description: 'Pago creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el pago' })
  @ApiResponse({ status: 500, description: 'Error al crear el miembro' })
  async create(@Body() body: CreatePaymentDto): Promise<Payment> {
    return await this.service.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un pago existente' })
  @ApiParam({ name: 'id', description: 'UUID del pago a actualizar' })
  @ApiResponse({ status: 200, description: 'Pago actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró el pago a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar el pago' })
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdatePaymentDto) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un pago por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del pago a eliminar' })
  @ApiResponse({ status: 204, description: 'Pago eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró el pago a eliminar' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar el pago (conflicto)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
  }

}
