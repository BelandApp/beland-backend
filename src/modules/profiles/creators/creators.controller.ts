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
import { Creator } from './entities/creator.entity';
import { CreatorsService } from './creators.service';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { CreatorQueryDto } from './dto/creator-query.dto';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { Request } from 'express';

@ApiTags('creators')
@Controller('creators')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class CreatorsController {
  constructor(private readonly service: CreatorsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar creadores de contenido con filtros, paginación y orden',
  })
  async findAll(
    @Query() query: CreatorQueryDto,
  ): Promise<RespGetArrayDto<Creator>> {
    return this.service.findAll(query);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un creador de contenido por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del creador' })
  @ApiResponse({ status: 200, description: 'Creador encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró el creador' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Creator> {
    return this.service.findOne(id);
  }

  @Get('me/profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener el perfil de creador del usuario autenticado',
  })
  async findByUser(@Req() req: Request): Promise<Creator> {
    return this.service.findByUser(req.user?.id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo perfil de creador de contenido' })
  @ApiResponse({ status: 201, description: 'Creador creado exitosamente' })
  @ApiResponse({
    status: 400,
    description: 'Datos inválidos para crear el creador',
  })
  async create(
    @Req() req: Request,
    @Body() body: CreateCreatorDto,
  ): Promise<Creator> {
    return this.service.create({
      ...body,
      user_id: req.user?.id,
    } as Partial<Creator>);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un perfil de creador de contenido' })
  @ApiParam({ name: 'id', description: 'UUID del creador' })
  @ApiResponse({
    status: 200,
    description: 'Creador actualizado correctamente',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el creador a actualizar',
  })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateCreatorDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un creador de contenido por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del creador' })
  @ApiResponse({
    status: 204,
    description: 'Creador eliminado correctamente',
  })
  @ApiResponse({
    status: 409,
    description: 'No se puede eliminar el creador (conflicto)',
  })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.service.remove(id);
  }
}
