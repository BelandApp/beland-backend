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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Hub } from './entities/hub.entity';
import { HubsService } from './hubs.service';
import { CreateHubDto } from './dto/create-hub.dto';
import { UpdateHubDto } from './dto/update-hub.dto';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { HubQueryDto } from './dto/hub-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { Request } from 'express';

@ApiTags('hubs')
@Controller('hubs')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class HubsController {
  constructor(private readonly service: HubsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar centros de acopio con filtros dinámicos, paginación y orden',
  })
  async findAll(
    @Query() query: HubQueryDto,
  ): Promise<RespGetArrayDto<Hub>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un centro de acopio por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del centro de acopio' })
  @ApiResponse({ status: 200, description: 'Centro de acopio encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró el centro de acopio' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Hub> {
    return await this.service.findOne(id);
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener centro de acopio asociado al usuario autenticado',
  })
  @ApiResponse({ status: 200, description: 'Centro de acopio encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró el centro de acopio' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findByUser(@Req() req: Request): Promise<Hub> {
    return await this.service.findByUser(req.user?.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo centro de acopio' })
  @ApiResponse({
    status: 201,
    description: 'Centro de acopio creado exitosamente',
  })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear el centro de acopio',
  })
  @ApiResponse({
    status: 500,
    description: 'No se pudo crear el centro de acopio',
  })
  async create(
    @Body() body: CreateHubDto,
    @Req() req: Request,
  ): Promise<Hub> {
    return await this.service.create({
      ...body,
      user_id: req.user?.id,
    });
  }

  @Put('disactive/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Dar de baja un centro de acopio y remover perfil HUB',
  })
  @ApiParam({ name: 'id', description: 'UUID del centro de acopio' })
  async disactiveHub(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Hub> {
    return this.service.disactiveHub(id);
  }

  @Put('active/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activar un centro de acopio y asignar perfil HUB',
  })
  @ApiParam({ name: 'id', description: 'UUID del centro de acopio' })
  async activateHub(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Hub> {
    return this.service.activateHub(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un centro de acopio' })
  @ApiParam({ name: 'id', description: 'UUID del centro de acopio' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateHubDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un centro de acopio por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del centro de acopio' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.service.remove(id);
  }
}
