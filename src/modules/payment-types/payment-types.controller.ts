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
import { PaymentType } from './entities/payment-type.entity';
import { PaymentTypesService } from './payment-types.service';
import { CreatePaymentTypeDto } from './dto/create-payment-type.dto';
import { UpdatePaymentTypeDto } from './dto/update-payment-type.dto';

@ApiTags('payment-types')
@Controller('payment-types')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class PaymentTypesController {
  constructor(private readonly service: PaymentTypesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar formas de pagos' })
  @ApiResponse({ status: 200, description: 'Listado de formas de pagos retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
  ): Promise<[PaymentType[], number]> {
    return await this.service.findAll();
  }

  @Get("services")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar formas de pagos para servicios' })
  @ApiResponse({ status: 200, description: 'Listado de formas de pagos retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAtServices(
  ): Promise<[PaymentType[], number]> {
    return await this.service.findAtServices();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una forma de pago por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de la forma de pago' })
  @ApiResponse({ status: 200, description: 'Forma de pago encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró la forma de pago' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<PaymentType> {
    return await this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva forma de pago' })
  @ApiResponse({ status: 201, description: 'Forma de pago creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear la forma de pago' })
  @ApiResponse({ status: 500, description: 'No se pudo crear la forma de pago' })
  async create(@Body() body: CreatePaymentTypeDto): Promise<PaymentType> {
    return await this.service.create(body);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una forma de pago existente' })
  @ApiParam({ name: 'id', description: 'UUID de la forma de pago' })
  @ApiResponse({ status: 200, description: 'Forma de pago actualizada correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la forma de pago a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la forma de pago' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdatePaymentTypeDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una forma de pago por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de la forma de pago' })
  @ApiResponse({ status: 204, description: 'Forma de pago eliminada correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la forma de pago a eliminar' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar la forma de pago (conflicto)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
  }
}
