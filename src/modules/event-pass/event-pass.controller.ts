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
  UploadedFiles,
  ParseFilePipeBuilder,
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
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { RespGetArrayDto } from 'src/dto/resp-get-Array.dto';
import { EventPassType } from './entities/event-pass-type.entity';

@ApiTags('event-pass')
@Controller('event-pass')
export class EventPassController {

  constructor(private readonly service: EventPassService
  ) {}

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
  ): Promise<RespGetArrayDto<EventPass>> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // En el service, pasás filters directamente
    return await this.service.findAll(pageNumber, limitNumber, filters);
  }

  @Get('event-type')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listado de los tipos de eventos' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, description: 'Listado retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllTypes(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
  ): Promise<RespGetArrayDto<EventPassType>> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    // En el service, pasás filters directamente
    return await this.service.findAllTypes(pageNumber, limitNumber);
  }

  @Get('user')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
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
  ): Promise<RespGetArrayDto<EventPass>> {
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Crea un nuevo EventPass con imagen principal e imágenes adicionales.',
    type: CreateEventPassDto,
  })
  async create(
    @Body() createEventPassDto: CreateEventPassDto,
    @UploadedFiles(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpg|jpeg|png|webp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 10_000_000, // 10 MB
          message: 'El archivo debe ser menor a 10 MB',
        })
        .build({
          errorHttpStatusCode: HttpStatus.BAD_REQUEST,
        }),
    ) 
    files: Express.Multer.File[],
    @Req() req: Request,
  ) {
    const user = req.user; // Usuario autenticado desde el token JWT
    return this.service.create(
      createEventPassDto,
      files,
      user.id,
    );
  }

  @Put('update-image/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
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
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
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
