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
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { FoundationsService } from './foundations.service';
import { Foundation } from './entities/foundation.entity';
import { CreateFoundationDto } from './dto/create-foundation.dto';
import { UpdateFoundationDto } from './dto/update-foundation.dto';
import { FoundationQueryDto } from './dto/foundation-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { Request } from 'express';

@ApiTags('foundations')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
@Controller('foundations')
export class FoundationsController {
  constructor(private readonly service: FoundationsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Listar fundaciones sin fines de lucro con filtros dinámicos, paginación y orden',
  })
  async findAll(
    @Query() query: FoundationQueryDto,
  ): Promise<RespGetArrayDto<Foundation>> {
    return this.service.findAll(query);
  }

  @Get('user/:user_id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener fundación asociada a un usuario',
  })
  @ApiParam({ name: 'user_id', description: 'UUID del usuario' })
  async findByUser(
    @Param('user_id', ParseUUIDPipe) user_id: string,
  ): Promise<Foundation> {
    return this.service.findByUser(user_id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener una fundación sin fines de lucro por ID',
  })
  @ApiParam({ name: 'id', description: 'UUID de la fundación' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Foundation> {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Crear una nueva fundación sin fines de lucro',
  })
  async create(
    @Body() body: CreateFoundationDto,
    @Req() req:Request,
  ): Promise<Foundation> {
    return this.service.create({...body, user_id:req.user?.id});
  }

  @Put('activate/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Activar fundación sin fines de lucro y asignar perfil FOUNDATION',
  })
  @ApiParam({ name: 'id', description: 'UUID de la fundación' })
  async activate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Foundation> {
    return this.service.activateFoundation(id);
  }

  @Put('disactive/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary:
      'Desactivar fundación sin fines de lucro y remover perfil FOUNDATION',
  })
  @ApiParam({ name: 'id', description: 'UUID de la fundación' })
  async disactive(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Foundation> {
    return this.service.disactiveFoundation(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar una fundación sin fines de lucro existente',
  })
  @ApiParam({ name: 'id', description: 'UUID de la fundación' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateFoundationDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Eliminar una fundación sin fines de lucro por ID',
  })
  @ApiParam({ name: 'id', description: 'UUID de la fundación' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.service.remove(id);
  }
}
