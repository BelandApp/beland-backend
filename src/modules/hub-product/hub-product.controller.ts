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
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { HubProductsService } from './hub-product.service'; 
import { HubProduct } from './entities/hub-product.entity';
import { CreateHubProductDto } from './dto/create-hub-product.dto';
import { UpdateHubProductDto } from './dto/update-hub-product.dto';
import { HubProductQueryDto } from './dto/hub-product-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { AddStockDto } from './dto/add-stock.dto'; 
import { DiscountStockDto } from './dto/discount-stock.dto';

@ApiTags('hub-products')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
@Controller('hub-products')
export class HubProductsController {
  constructor(
    private readonly service: HubProductsService,
  ) {}

  // LISTAR STOCK (GENERAL)
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Listar stock de centros de acopio con filtros por hub, producto y cantidad',
  })
  async findAll(
    @Query() query: HubProductQueryDto,
  ): Promise<RespGetArrayDto<HubProduct>> {
    return this.service.findAll(query);
  }

  // OBTENER ITEM DE STOCK
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener detalle de un item de stock',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del item de stock',
  })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<HubProduct> {
    return this.service.findOne(id);
  }

  // CREAR ITEM DE STOCK
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear un nuevo item de stock para un centro de acopio',
  })
  async create(
    @Body() body: CreateHubProductDto,
  ): Promise<HubProduct> {
    return this.service.create(body);
  }

  // ACTUALIZAR ITEM DE STOCK
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar datos de un item de stock',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del item de stock',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateHubProductDto,
  ) {
    return this.service.update(id, body);
  }

  // AGREGAR STOCK
  @Put(':id/add-stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Agregar cantidad al stock de un producto en un hub',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del item de stock',
  })
  async addStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: AddStockDto,
  ): Promise<HubProduct> {
    return this.service.addStock(id, body.quantity);
  }

  // DESCONTAR STOCK
  @Put(':id/discount-stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Descontar cantidad del stock de un producto en un hub',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del item de stock',
  })
  async discountStock(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: DiscountStockDto,
  ): Promise<HubProduct> {
    return this.service.discountStock(id, body.quantity);
  }

  // ELIMINAR ITEM DE STOCK
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar un item de stock',
  })
  @ApiParam({
    name: 'id',
    description: 'UUID del item de stock',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.service.remove(id);
  }
}
