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
  BadRequestException,
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
import { UserResourcesService } from './user-resources.service';
import { UserResource } from './entities/user-resource.entity';
import { Request } from 'express';
import { CreateUserResourceDto } from './dto/create-user-resource.dto';
import { UpdateUserResourceDto } from './dto/update-user-resource.dto';
import { TransferResource } from './entities/transfer-resource.entity';
import { CreateTransferResourceDto } from './dto/create-transfer-resource.dto';

@ApiTags('user-resources')
@Controller('user-resources')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class UserResourcesController {
  constructor(private readonly service: UserResourcesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar recursos del usuario con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' }) 
  @ApiQuery({ name: 'resource_id', required: false, type: String, description: 'Filtrar por ID del tipo de recurso del usuario. (opcional)' })  
  @ApiResponse({ status: 200, description: 'Listado de recursos del usuario retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('resource_id') resource_id = '',
    @Req() req: Request,
  ): Promise<[UserResource[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAll(req.user.id, resource_id, pageNumber, limitNumber);
  }

  @Get('transfer-commerce-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar las transferencias para compra de recursos del comerciante con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' }) 
  @ApiQuery({ name: 'status_id', required: false, type: String, description: 'Filtrar por ID del estado de trnasaccion. (opcional)' })  
  @ApiResponse({ status: 200, description: 'Listado de las transferencias para compra de recursos dale comerciante retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllCommerceTransfer(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status_id') status_id,
    @Req() req: Request,
  ): Promise<[TransferResource[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAllCommerceTransfer(req.user.id, pageNumber, limitNumber, status_id);
  }

  @Get('transfer-user-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar transferencias de recursos del usuario con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' }) 
  @ApiQuery({ name: 'status_id', required: false, type: String, description: 'Filtrar por ID del estado de trnasaccion. (opcional)' })  
  @ApiResponse({ status: 200, description: 'Listado de transferencias de recursos del usuario retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllUserTransfer(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status_id') status_id,
    @Req() req: Request,
  ): Promise<[TransferResource[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAllUserTransfer(req.user.id, pageNumber, limitNumber,status_id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un recurso de usuario por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de el recurso de usuario' })
  @ApiResponse({ status: 200, description: 'Recurso de usuario encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró el recurso de usuario' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserResource> {
    return await this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo recurso de usuario' })
  @ApiResponse({ status: 201, description: 'Recurso de usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el recurso de usuario' })
  @ApiResponse({ status: 500, description: 'No se pudo crear el recurso de usuario' })
  async create(@Body() body: CreateUserResourceDto, @Req() req: Request,): Promise<UserResource> {
    return await this.service.create({...body, user_id: req.user?.id});
  }

  @Post('purchase-transfer')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una compra de recurso de usuario por transferencia' })
  @ApiResponse({ status: 201, description: 'Transferencia de Recurso de usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear la transferencia de recurso de usuario' })
  @ApiResponse({ status: 500, description: 'No se pudo crear la transferencia de recurso de usuario' })
  async purchaseByTransfer(@Body() body: CreateTransferResourceDto, @Req() req: Request,): Promise<TransferResource> {
    return await this.service.purchaseByTransfer(req.user.id, body);
  }

  @Put('transfer-completed/:transfer_resource_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar a estado Completado la transferencia y asignar el recurso al usuario' })
  @ApiParam({ name: 'transfer_resource_id', description: 'UUID de la transferencia del recurso de usuario' })
  @ApiResponse({ status: 200, description: 'Transferencia de usuario actualizado y recurso asignado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la transferencia del recurso de usuario a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la transferencia del recurso de usuario' })
  async transferCompleted(
    @Param('transfer_resource_id', ParseUUIDPipe) transfer_resource_id: string
  ) {
    return this.service.transferCompleted(transfer_resource_id);
  }

  @Put('transfer-failed/:transfer_resource_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar a estado Fallido la transferencia' })
  @ApiParam({ name: 'transfer_resource_id', description: 'UUID de la transferencia del recurso de usuario' })
  @ApiResponse({ status: 200, description: 'Transferencia de usuario actualizado' })
  @ApiResponse({ status: 404, description: 'No se encontró la transferencia del recurso de usuario a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la transferencia del recurso de usuario' })
  async transferFailed(
    @Param('transfer_resource_id', ParseUUIDPipe) transfer_resource_id: string
  ) {
    return this.service.transferFailed(transfer_resource_id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un recurso de usuario existente' })
  @ApiParam({ name: 'id', description: 'UUID de el recurso de usuario' })
  @ApiResponse({ status: 200, description: 'Recurso de usuario actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró el recurso de usuario a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar el recurso de usuario' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserResourceDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un recurso de usuario por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de el recurso de usuario' })
  @ApiResponse({ status: 204, description: 'Recurso de usuario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró el recurso de usuario a eliminar' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar el recurso de usuario (conflicto)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
  }
}
