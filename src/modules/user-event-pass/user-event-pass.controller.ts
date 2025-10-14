import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { UserEventPassService } from './user-event-pass.service';
import { UserEventPass } from './entities/user-event-pass.entity';
import { UserEventPassFiltersDto } from './dto/user-eventpass-filters.dto';
import { Request } from 'express';
import { CreateUserEventPassDto } from './dto/create-user-event-pass.dto';

@ApiTags('user-event-passes')
@ApiBearerAuth()
@Controller('user-event-passes')
export class UserEventPassController {
  constructor(private readonly service: UserEventPassService) {}

  /**
   * 🔍 Listado global de todas las entradas (Admin)
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listado global con paginación y filtros' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado retornado correctamente' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query() filters?: UserEventPassFiltersDto,
  ): Promise<[UserEventPass[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return this.service.findAll(pageNumber, limitNumber, filters);
  }

  /**
   * 🔍 Listado de entradas del usuario autenticado
   * Se fuerza user_id en los filtros
   */
  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listado de entradas del usuario autenticado' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado retornado correctamente' })
  async findAllUser(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req: Request,
    @Query() filters?: UserEventPassFiltersDto,
  ): Promise<[UserEventPass[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Forzamos el filtro por usuario
    filters = { ...filters, user_id: (req.user as any).id };

    return this.service.findAll(pageNumber, limitNumber, filters);
  }

  /**
   * 🔎 Obtener una entrada específica
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener entrada por ID' })
  @ApiResponse({ status: 200, description: 'Entrada retornada correctamente' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<UserEventPass> {
    return this.service.findOne(id);
  }

  /**
   * 🎟️ Comprar/Adquirir un EventPass
   */
  @Post('purchase')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Comprar un EventPass' })
  @ApiResponse({ status: 201, description: 'Compra realizada correctamente' })
  async purchaseEventPass(
    @Body() createDto: CreateUserEventPassDto,
    @Req() req: Request,
  ): Promise<UserEventPass> {
    const user_id = (req.user as any).id;

    return this.service.purchaseEventPass(
      user_id,
      createDto.event_pass_id,
      createDto.holder_name,
      createDto.holder_phone,
      createDto.holder_document,
    );
  }

  /**
   * 🔄 Reembolso/Devolución de EventPass
   */
  @Post('refund/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Solicitar reembolso de un EventPass' })
  @ApiResponse({ status: 200, description: 'Reembolso realizado correctamente' })
  async refundEventPass(
    @Param('id', ParseUUIDPipe) user_eventpass_id: string,
    @Req() req: Request,
  ): Promise<UserEventPass> {
    const user_id = (req.user as any).id;
    return this.service.refundEventPass(user_id, user_eventpass_id);
  }

   /**
   * 🎫 Marcar entrada como consumida
   */
  @Post('consume')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Marcar entrada como consumida' })
  @ApiQuery({
    name: 'user_eventpass_id',
    required: true,
    description: 'ID de la entrada adquirida',
    example: '8aef5c2e-4f83-4a0f-8e6b-d36ac4e4f33a',
  })
  @ApiQuery({
    name: 'eventpass_id',
    required: true,
    description: 'ID de la entrada Creada por el comerciante que se obtiene desencriptando el QR',
    example: 'b1c3d57f-41a9-4a56-9b6d-24d238a14d8f',
  })
  @ApiResponse({ status: 200, description: 'Entrada consumida correctamente' })
  async consumeEventPass(
    @Query('user_eventpass_id') user_eventpass_id: string,
    @Query('eventpass_id') eventpass_id: string,
  ): Promise<{ success: boolean; message: string; userEventPass?: UserEventPass }> {
    return this.service.consumeEventPass(user_eventpass_id, eventpass_id);
  }
}
