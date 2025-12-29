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
  BadRequestException,
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
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

import { ServiceService } from './services.service';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceFiltersDto } from './dto/service-filters.dto';
import { RespGetArrayDto } from 'src/dto/resp-app.dto';

@ApiTags('services')
@Controller('services')
export class ServiceController {
  constructor(
    private readonly service: ServiceService,
  ) {}

  // ============================
  // LISTADO
  // ============================
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listado de servicios con paginación y filtrado' })
  @ApiResponse({ status: 200, description: 'Listado retornado correctamente' })
  async findAll(
    @Query() filters: ServiceFiltersDto,
  ): Promise<RespGetArrayDto<Service>> {
    const page = filters.page ?? 1;
    const limit = filters.limit ?? 10;

    return await this.service.findAll(page, limit, filters);
  }

  // ============================
  // OBTENER UNO
  // ============================
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener servicio por ID' })
  @ApiParam({ name: 'id', description: 'UUID del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio encontrado' })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Service> {
    return await this.service.findOne(id);
  }

  // ============================
  // CREAR
  // ============================
  @Post()
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
  @UseInterceptors(FileInterceptor('image_url'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Crea un nuevo servicio con imagen',
    type: CreateServiceDto,
  })
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const user = req.user;

    // ✅ Validación manual de imagen
    if (file) {
      if (!/^image\/(jpeg|jpg|png|webp)$/.test(file.mimetype)) {
        throw new BadRequestException(
          `Formato de archivo inválido (${file.originalname}). Solo JPG, PNG o WEBP.`,
        );
      }

      if (file.size > 10_000_000) {
        throw new BadRequestException(
          `El archivo ${file.originalname} supera los 10 MB permitidos.`,
        );
      }
    }

    return await this.service.create(
      createServiceDto,
      file,
      user?.id,
    );
  }

  // ============================
  // ACTUALIZAR IMAGEN
  // ============================
  @Put('update-image/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
  @UseInterceptors(FileInterceptor('image_url'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar imagen del servicio' })
  @ApiParam({ name: 'id', description: 'UUID del servicio' })
  @ApiBody({
    description: 'Debe subir un archivo de imagen',
    schema: {
      type: 'object',
      properties: {
        image_url: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async updateImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Debe subir una imagen');
    }

    if (!/^image\/(jpeg|jpg|png|webp)$/.test(file.mimetype)) {
      throw new BadRequestException('Formato de imagen inválido');
    }

    if (file.size > 10_000_000) {
      throw new BadRequestException('La imagen supera los 10 MB');
    }

    return await this.service.updateImage(id, file);
  }

  // ============================
  // ACTIVAR / DESACTIVAR
  // ============================
  @Put('active/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Activar servicio' })
  async active(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.update(id, { is_active: true });
  }

  @Put('disactive/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Desactivar servicio' })
  async disactive(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.update(id, { is_active: false });
  }

  @Put('enable/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Habilitar servicio' })
  @ApiParam({ name: 'id', description: 'UUID del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio habilitado correctamente' })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  async enable(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.update(id, { is_available: true });
  }

  @Put('disable/:id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Deshabilitar servicio' })
  @ApiParam({ name: 'id', description: 'UUID del servicio' })
  @ApiResponse({ status: 200, description: 'Servicio deshabilitado correctamente' })
  @ApiResponse({ status: 404, description: 'Servicio no encontrado' })
  async disable(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.update(id, { is_available: false });
  }


  // ============================
  // UPDATE
  // ============================
  @Put(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar servicio' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateServiceDto,
  ) {
    return this.service.update(id, body);
  }

  // ============================
  // DELETE
  // ============================
  @Delete(':id')
  @ApiBearerAuth('JWT-auth')
  @UseGuards(FlexibleAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar servicio' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.service.remove(id);
  }
}
