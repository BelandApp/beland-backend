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
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { EventPassService } from './event-pass.service';
import { EventPass } from './entities/event-pass.entity';
import { CreateEventPassDto } from './dto/create-event-pass.dto';
import { UpdateEventPassDto } from './dto/update-event-pass.dto';
import { EventPassFiltersDto } from './dto/event-pass-filter.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('event-pass')
@Controller('event-pass')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class EventPassController {

  constructor(private readonly service: EventPassService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listado con paginación y filtrado' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query() filters: EventPassFiltersDto, 
  ): Promise<[EventPass[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // En el service, pasás filters directamente
    return await this.service.findAll(pageNumber, limitNumber, filters);
  }

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listado con paginación y filtrado por usuario creador' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllUser(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req: Request,
    @Query() filters: EventPassFiltersDto, 
  ): Promise<[EventPass[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // Sobrescribo created_by_id con el usuario que hace la petición
    filters.created_by_id = (req.user as any).id;

      return await this.service.findAll(pageNumber, limitNumber, filters);
    }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: `Obtener entrada a evento por su ID` })
  @ApiParam({ name: 'id', description: 'UUID de la entrada a evento' })
  @ApiResponse({ status: 200, description: 'Entrada a evento encontrada' })
  @ApiResponse({ status: 404, description: 'No se encontró la entrada a evento' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<EventPass> {
    return await this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva entrada a evento' })
  @ApiResponse({ status: 201, description: 'Entrada a evento creada exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear la entrada a evento' })
  @ApiResponse({ status: 500, description: 'No se pudo crear la entrada a evento' })
  async create(@Body() body: CreateEventPassDto): Promise<EventPass> {
    return await this.service.create(body);
  }

  @Put('update-image/:id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar imagen de entrada para evento' })
  @ApiParam({ name: 'id', description: 'ID del usuario', type: 'string', format: 'uuid' })
  @ApiBody({
    description: `Debe subir el Archivo de Imagen`,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Imagen de entrada subida exitosamente' })
    async updateImage(
      @Param('id', ParseUUIDPipe) id: string,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new MaxFileSizeValidator({
              maxSize: 10000000,
              message: 'El Archivo debe ser menor a 10Mb',
            }),
            new FileTypeValidator({
              fileType: /(.jpg|.jpeg|.png|.webp)$/,
            }),
          ],
        }),
      )
      file: Express.Multer.File,
    ) {
      console.log('File', file);
      return await this.service.updateImage(id, file);
    }

  @Put('active/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una entrada a evento existente' })
  @ApiParam({ name: 'id', description: 'UUID de la entrada a evento' })
  @ApiResponse({ status: 200, description: 'Entrada a evento actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la entrada a evento a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la entrada a evento' })
  async active(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.service.update(id, {is_active:true});
  }

  @Put('disactive/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una entrada a evento existente' })
  @ApiParam({ name: 'id', description: 'UUID de la entrada a evento' })
  @ApiResponse({ status: 200, description: 'Entrada a evento actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la entrada a evento a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la entrada a evento' })
  async disactive(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return this.service.update(id, {is_active:false});
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar una entrada a evento existente' })
  @ApiParam({ name: 'id', description: 'UUID de la entrada a evento' })
  @ApiResponse({ status: 200, description: 'Entrada a evento actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la entrada a evento a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar la entrada a evento' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateEventPassDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una entrada a evento por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de la entrada a evento' })
  @ApiResponse({ status: 204, description: 'Entrada a evento eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró la entrada a evento a eliminar' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar la entrada a evento (conflicto)' })
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    await this.service.remove(id);
  }
}
