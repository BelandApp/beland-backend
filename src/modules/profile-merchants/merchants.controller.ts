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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { MerchantsService } from './merchants.service';
import { Merchant } from './entities/merchant.entity';
import { CreateMerchantDto } from './dto/create-merchant.dto';
import { UpdateMerchantDto } from './dto/update-merchant.dto';
import { MerchantQueryDto } from './dto/merchant-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';

@ApiTags('merchants')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
@Controller('merchants')
export class MerchantsController {
  constructor(private readonly service: MerchantsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar comercios con filtros dinámicos, paginación y orden',
  })
  async findAll(
    @Query() query: MerchantQueryDto,
  ): Promise<RespGetArrayDto<Merchant>> {
    return this.service.findAll(query);
  }

  @Get('user/:user_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener comercio asociado a un usuario',
  })
  @ApiParam({ name: 'user_id', description: 'UUID del usuario' })
  async findByUser(
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ): Promise<Merchant> {
    return this.service.findByUser(user_id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un comercio por ID' })
  @ApiParam({ name: 'id', description: 'UUID del comercio' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Merchant> {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo comercio' })
  async create(
    @Body() body: CreateMerchantDto,
  ): Promise<Merchant> {
    return this.service.create(body);
  }

  @Put('activate/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activar comercio y asignar perfil MERCHANT',
  })
  @ApiParam({ name: 'id', description: 'UUID del comercio' })
  async activate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Merchant> {
    return this.service.activateMerchant(id);
  }

  @Put('disactive/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desactivar comercio y remover perfil MERCHANT',
  })
  @ApiParam({ name: 'id', description: 'UUID del comercio' })
  async disactive(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Merchant> {
    return this.service.disactiveMerchant(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un comercio existente' })
  @ApiParam({ name: 'id', description: 'UUID del comercio' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateMerchantDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un comercio por ID' })
  @ApiParam({ name: 'id', description: 'UUID del comercio' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.service.remove(id);
  }
}
