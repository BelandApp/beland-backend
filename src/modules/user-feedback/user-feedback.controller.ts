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
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { Request } from 'express';
import { UserFeedbackService } from './user-feedback.service';
import { UserFeedback } from './entities/user-feedback.entity';
import { CreateUserFeedbackDto } from './dto/create-user-feedback.dto';
import { UpdateUserFeedbackDto } from './dto/update-user-feedback.dto';

@ApiTags('user-feedback')
@Controller('user-feedback')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class UserFeedbackController {
  constructor(private readonly service: UserFeedbackService) {}

  @Get('user')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar feedbacks con paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1, description: 'Número de página' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10, description: 'Cantidad de elementos por página' })
  @ApiResponse({ status: 200, description: 'Listado de feedbacks retornado correctamente' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAllUser(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Req() req: Request,
  ): Promise<[UserFeedback[], number]> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);
    return await this.service.findAllUser(req.user.id, pageNumber, limitNumber);
  }

  @Get('feedback-review')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Listar feedbacks con filtros y paginación' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'user_id', required: false, type: String })
  @ApiQuery({ name: 'section', required: false, type: String })
  @ApiQuery({ name: 'rating', required: false, type: Number })
  @ApiQuery({ name: 'platform', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Listado de feedbacks con filtros' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findAll(
    @Query('page') page = '1',
    @Query('limit') limit = '10',
    @Query('user_id') user_id?: string,
    @Query('section') section?: string,
    @Query('rating') rating?: number,
    @Query('platform') platform?: string,
  ): Promise<{ data: UserFeedback[]; total: number }> {
    const pageNumber = parseInt(page, 10);
    const limitNumber = parseInt(limit, 10);

    return await this.service.findAll({
      page: pageNumber,
      limit: limitNumber,
      user_id,
      section,
      rating: rating ? Number(rating) : undefined,
      platform,
    });
  }


  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Obtener un feedbacks por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de el feedbacks' })
  @ApiResponse({ status: 200, description: 'Feedbacks encontrado' })
  @ApiResponse({ status: 404, description: 'No se encontró el feedbacks' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor' })
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<UserFeedback> {
    return await this.service.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo feedbacks' })
  @ApiResponse({ status: 201, description: 'Feedbacks creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos para crear el feedbacks' })
  @ApiResponse({ status: 500, description: 'No se pudo crear el feedbacks' })
  async create(@Body() body: CreateUserFeedbackDto, @Req() req:Request): Promise<UserFeedback> {
    return await this.service.create({...body, user_id: req.user.id});
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Actualizar un feedbacks existente' })
  @ApiParam({ name: 'id', description: 'UUID de el feedbacks' })
  @ApiResponse({ status: 200, description: 'Feedbacks actualizado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró el feedbacks a actualizar' })
  @ApiResponse({ status: 500, description: 'Error al actualizar el feedbacks' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserFeedbackDto,
  ) {
    return this.service.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar un feedbacks por su ID' })
  @ApiParam({ name: 'id', description: 'UUID de el feedbacks' })
  @ApiResponse({ status: 204, description: 'Feedbacks eliminado correctamente' })
  @ApiResponse({ status: 404, description: 'No se encontró el feedbacks a eliminar' })
  @ApiResponse({ status: 409, description: 'No se puede eliminar el feedbacks (conflicto)' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.service.remove(id);
  }
}
