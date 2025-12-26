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
import { OrderItemsService } from './order-items.service';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { OrderItemConsumptionService } from './order-item-consumption.service';
import { Request } from 'express';
import { MarkConsumedDto } from './dto/mark-consumed.dto';

@ApiTags('order-items')
@Controller('order-items')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class OrderItemsController {
  constructor(
    private readonly service: OrderItemsService,
    private readonly serviceConsumption: OrderItemConsumptionService
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar items de Ordenes con paginación y filtrado por orden' })
  @ApiQuery({ name: 'order_id', required: true, type: String, description: 'Filtrar items de ordenes por ID de orden, si no se envia retorna todos los items' })
  @ApiResponse({ status: 200, description: 'Listado de items de Orden retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('order_id') order_id,
  ): Promise<[OrderItem[], number]> {
    return await this.service.findAll(order_id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un item de Orden por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del item de Orden' })
  @ApiResponse({ status: 200, description: 'item de Orden encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró el item de Orden' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<OrderItem> {
    return await this.service.findOne(id);
  }

  @Post('consumption')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({summary: 'Registrar consumo de productos en una orden grupal'})
  @ApiResponse({status: 201,description: 'Consumos registrados correctamente'})
  @ApiResponse({status: 400,description: 'Datos inválidos o consumo no permitido'})
  @ApiResponse({status: 403,description: 'El usuario no pertenece al grupo'})
  @ApiResponse({status: 404,description: 'Orden o productos no encontrados'})
  async markConsumed(
    @Body() body: MarkConsumedDto,
    @Req() req: Request,
  ): Promise<{ success: boolean; message: string }> {

    return this.serviceConsumption.markConsumed(
      body.order_item_ids,
      req.user.id,
    );
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo item de Orden' })
  @ApiResponse({ status: 201, description: 'item de Orden creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el item de Orden' })
  @ApiResponse({ status: 500, description: 'No se pudo crear el item de Orden' })
  async create(@Body() body: CreateOrderItemDto): Promise<OrderItem> {
    return await this.service.create(body);
  }

  @Put('devolution/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Devolucion de un producto de una Orden existente' })
  @ApiParam({ name: 'id', description: 'UUID del item de Orden' })
  @ApiQuery({ name: 'returned_quantity', required: true, type: Number, example: 1, description: 'Cantidad devuelta del producto' })
  @ApiResponse({ status: 200, description: 'item de Orden actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró el item de Orden a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar el item de Orden' })
  async devolution(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('returned_quantity') returned_quantity: number,
  ) {
    return this.service.update(id, { returned_quantity });
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un item de Orden existente' })
  @ApiParam({ name: 'id', description: 'UUID del item de Orden' })
  @ApiResponse({ status: 200, description: 'item de Orden actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró el item de Orden a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar el item de Orden' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateOrderItemDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un item de Orden por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del item de Orden' })
  @ApiResponse({ status: 204, description: 'item de Orden eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró el item de Orden a eliminar' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar el item de Orden (conflicto)' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}
