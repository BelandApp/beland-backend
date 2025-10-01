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
import { Request } from 'express';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { UserRechargeService } from './user-recharge.service';
import { RechargeTransfer } from './entities/user-recharge.entity';
import { CreateRechargeTransferDto } from './dto/create-user-recharge.dto';
@ApiTags('user-recharge')
@Controller('user-recharge')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class UserRechargeController {
  constructor(private readonly service: UserRechargeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar recargas de usuario con paginación y filtrado por estado' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiQuery({ name: 'status_id', required: false, type: String, description: 'UUID del status por el cual se quiere filtrar. Si no viene retorna todas' })
  @ApiResponse({ status: 200, description: 'Listado de recargas de usuarioretornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('status_id') status_id?,
  ): Promise<[RechargeTransfer[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAll(pageNumber, limitNumber, status_id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener una recarga de usuario por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de la recarga de usuario' })
  @ApiResponse({ status: 200, description: 'Recarga de usuario encontrada' })
  @ApiResponse({ status: 404, description: 'No se encontró la recarga de usuario' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<RechargeTransfer> {
    return await this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva recarga de usuario' })
  @ApiResponse({ status: 201, description: 'Recarga de usuario creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear la recarga de usuario' })
  @ApiResponse({ status: 500, description: 'No se pudo crear la recarga de usuario' })
  async create(@Body() body: CreateRechargeTransferDto, @Req() req:Request): Promise<RechargeTransfer> {
    return await this.service.rechargeTransfer(req.user.id, body);
  }

  @Put("completed/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una recarga de usuario existente' })
  @ApiParam({ name: 'id', description: 'UUID de la recarga de usuario' })
  @ApiResponse({ status: 200, description: 'Recarga de usuario actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la recarga de usuario a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la recarga de usuario' })
  async rechargeCompleted (@Param('id', ParseUUIDPipe) id: string) {
    return this.service.rechargeCompleted(id);
  }

  @Put("failed/:id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una recarga de usuario existente' })
  @ApiParam({ name: 'id', description: 'UUID de la recarga de usuario' })
  @ApiResponse({ status: 200, description: 'Recarga de usuario actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la recarga de usuario a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la recarga de usuario' })
  async rechargeFailed (@Param('id', ParseUUIDPipe) id: string) {
    return this.service.rechargeFailed(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una recarga de usuario por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de la recarga de usuario' })
  @ApiResponse({ status: 204, description: 'Recarga de usuario eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la recarga de usuario a eliminar' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar la recarga de usuario (conflicto)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
  }
}
