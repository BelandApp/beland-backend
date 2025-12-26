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
import { RecyclersService } from './recyclers.service';
import { RecyclerBase } from './entities/recycler.entity';
import { CreateRecyclerBaseDto } from './dto/create-recycler.dto';
import { UpdateRecyclerBaseDto } from './dto/update-recycler.dto';
import { RecyclerBaseQueryDto } from './dto/recycler-base-query.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';
import { Request } from 'express';

@ApiTags('recyclers')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
@Controller('recyclers')
export class RecyclersController {
  constructor(private readonly service: RecyclersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Listar recicladores de base con filtros, paginación y orden',
  })
  async findAll(
    @Query() query: RecyclerBaseQueryDto,
  ): Promise<RespGetArrayDto<RecyclerBase>> {
    return this.service.findAll(query);
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Obtener reciclador de base asociado a un usuario',
  })
  async findByUser(
    @Req() req: Request,
  ): Promise<RecyclerBase> {
    return this.service.findByUser(req.user?.id);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un reciclador de base por ID' })
  @ApiParam({ name: 'id', description: 'UUID del reciclador' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RecyclerBase> {
    return this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo reciclador de base' })
  async create(
    @Body() body: CreateRecyclerBaseDto,
    @Req() req:Request
  ): Promise<RecyclerBase> {
    return this.service.create({...body, user_id: req.user?.id});
  }

  @Put('activate/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Activar reciclador de base y asignar perfil RECYCLER_BASE',
  })
  @ApiParam({ name: 'id', description: 'UUID del reciclador' })
  async activate(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RecyclerBase> {
    return this.service.activateRecycler(id);
  }

  @Put('disactive/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Desactivar reciclador de base y remover perfil RECYCLER_BASE',
  })
  @ApiParam({ name: 'id', description: 'UUID del reciclador' })
  async disactive(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RecyclerBase> {
    return this.service.disactiveRecycler(id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un reciclador de base existente' })
  @ApiParam({ name: 'id', description: 'UUID del reciclador' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateRecyclerBaseDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un reciclador de base por ID' })
  @ApiParam({ name: 'id', description: 'UUID del reciclador' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.service.remove(id);
  }
}
