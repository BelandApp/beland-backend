// src/groups/groups.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
  ParseUUIDPipe, // Para validar IDs como UUIDs automáticamente
  Put, // Importar ValidationPipe
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiBody, // Para documentar el cuerpo de la solicitud en Swagger
} from '@nestjs/swagger';
// Rutas absolutas para guards y decoradores
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { Request } from 'express'; 
import { Group } from './entities/group.entity';
import { GetGroupsQueryDto } from './dto/filters-groups.dto';

@ApiTags('groups') // Etiqueta para la documentación de Swagger
@Controller('groups')
// Importante: NO HAY @UseGuards a nivel de controlador. Se aplicarán de forma granular.
export class GroupsController {

  constructor(
    private readonly groupsService: GroupsService,
  ) {}

  // src/groups/groups.controller.ts

  @Get()
  @UseGuards(FlexibleAuthGuard)
  @ApiOperation({
    summary: 'Listar grupos con filtros, paginación y orden',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({
    status: 200,
    description: 'Listado paginado de grupos',
    type: [Group],
  })
  async findAll(
    @Query() query: GetGroupsQueryDto,
  ): Promise<{
    data: Group[];
    total: number;
    page: number;
    limit: number;
  }> {
    return this.groupsService.findAll(query);
  }


  @Get('by-user')
  @UseGuards(FlexibleAuthGuard) // Solo requiere autenticación
  @ApiOperation({
    summary:'Obtener todos los grupos a los que pertenece el usuario autenticado',
    description:'Recupera una lista de todos los grupos de los que el usuario autenticado es miembro o líder. Requiere autenticación.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({status: 200,description:'Lista de grupos a los que pertenece el usuario, con información completa.'})
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description: 'Prohibido (ID de usuario no encontrado).'})
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({name: 'is_active', required: false, type: Boolean, description:'Filtrar grupos activos'})
  async getGroupsByUserId(@Req() req: Request, @Query('is_active') is_active: boolean): Promise<Group[]> {
    return await this.groupsService.getGroupsByUserId(req.user?.id, is_active);
  }

  @Post()
  @UseGuards(FlexibleAuthGuard) 
  @ApiOperation({
    summary: 'Crear un nuevo grupo',
    description:'Crea un nuevo grupo y asigna al usuario autenticado como su líder y primer miembro.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({status: 201,description: 'Grupo creado exitosamente.'})
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description: 'Prohibido (ID de usuario no encontrado o rol insuficiente).'})
  @ApiResponse({ status: 404, description: 'Líder de usuario no encontrado.' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createGroupDto: CreateGroupDto,
    @Req() req: Request,
  ): Promise<Group> {
    return await this.groupsService.createGroup(
        createGroupDto,
        req.user?.id,
      );

  }

  @Get(':groupId')
  @UseGuards(FlexibleAuthGuard)
  @ApiOperation({
    summary: 'Obtener grupo por ID (acceso autorizado)',
    description:'Recupera los detalles de un grupo específico. Los líderes de grupo y los Administradores/Superadministradores pueden ver cualquier grupo. Los miembros regulares pueden ver los grupos de los que forman parte. Requiere autenticación.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'groupId',description: 'ID del grupo a recuperar.',type: String})
  @ApiResponse({status: 200,description: 'Grupo encontrado exitosamente.',type: Group})
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description: 'Prohibido (no autorizado para ver este grupo).'})
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  async findOne(
    @Param('groupId', ParseUUIDPipe) groupId: string, 
  ): Promise<Group> {
      return await this.groupsService.findGroupById(groupId);
  }

  @Put('soft-delete/:groupId')
  @UseGuards(FlexibleAuthGuard)
  @ApiOperation({summary: 'Hace un softdelete de un grupo por ID'})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'groupId',description: 'El ID del grupo a eliminar.',type: String})
  @ApiResponse({status: 200,description: 'Grupo eliminado exitosamente.'})
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description:'Prohibido (el usuario actual no es el líder del grupo y no es un Admin/Superadmin).'})
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  async softDelete(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Req() req: Request,
  ): Promise<{success: boolean, message: string}> {
      return await this.groupsService.update(groupId, {deleted_at: new Date(), is_delete:true}, req.user?.id);
  }

  @Put('reverse-soft-delete/:groupId')
  @UseGuards(FlexibleAuthGuard)
  @ApiOperation({summary: 'Revierte un softdelete de un grupo por ID'})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'groupId',description: 'El ID del grupo a restaurar.',type: String})
  @ApiResponse({status: 200,description: 'Grupo restaurado exitosamente.'})
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description:'Prohibido (el usuario actual no es el líder del grupo y no es un Admin/Superadmin).'})
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  async reverseSoftDelete(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Req() req: Request,
  ): Promise<{success: boolean, message: string}> {
      return await this.groupsService.update(groupId, {deleted_at: null, is_delete:false}, req.user?.id);
  }

  @Put('reactive/:groupId')
  @UseGuards(FlexibleAuthGuard)
  @ApiOperation({summary: 'Reactiva un grupo por ID'})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'groupId',description: 'El ID del grupo a reactivar.',type: String})
  @ApiResponse({status: 200,description: 'Grupo reactivado exitosamente.'})
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description:'Prohibido (el usuario actual no es el líder del grupo y no es un Admin/Superadmin).'})
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  async active(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Req() req: Request,
  ): Promise<{success: boolean, message: string}> {
      return await this.groupsService.update(groupId, {is_active:true}, req.user?.id);
  }

  @Put('disactive/:groupId')
  @UseGuards(FlexibleAuthGuard)
  @ApiOperation({summary: 'Cambia a inactivo un grupo por ID'})
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'groupId',description: 'El ID del grupo a desactivar.',type: String})
  @ApiResponse({status: 200,description: 'Grupo desactivado exitosamente.'})
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description:'Prohibido (el usuario actual no es el líder del grupo y no es un Admin/Superadmin).'})
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  async disactive(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Req() req: Request,
  ): Promise<{success: boolean, message: string}> {
      return await this.groupsService.update(groupId, {is_active:false}, req.user?.id);
  }

  @Put(':groupId')
  @UseGuards(FlexibleAuthGuard)
  @ApiOperation({
    summary: 'Actualizar un grupo por ID',
    description:'Actualiza los detalles de un grupo específico. Solo el líder del grupo o un administrador/superadministrador puede realizar esta acción.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'groupId',description: 'El ID del grupo a actualizar.',type: String})
  @ApiResponse({status: 200,description: 'Grupo actualizado exitosamente.',type: Group})
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description:'Prohibido (el usuario actual no es el líder del grupo y no es un Admin/Superadmin).'})
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  async update(
    @Param('groupId', ParseUUIDPipe) groupId: string, // Asegura que el ID es un UUID
    @Body() Body: UpdateGroupDto,
    @Req() req: Request,
  ): Promise<{success: boolean, message: string}> {
      return await this.groupsService.update(groupId, Body, req.user?.id);
  }

  @Delete(':groupId')
  @UseGuards(FlexibleAuthGuard)
  @ApiOperation({
    summary: 'Eliminar un grupo por ID',
    description:'Elimina un grupo. Solo el líder del grupo o un administrador/superadministrador puede realizar esta acción.'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({name: 'groupId',description: 'El ID del grupo a eliminar',type: String})
  @ApiResponse({status: 204, description: 'Grupo eliminado exitosamente (Sin contenido).'})
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description:'Prohibido (el usuario actual no es el líder del grupo y no es un Admin/Superadmin).'})
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  async remove(
    @Param('groupId', ParseUUIDPipe) groupId: string, // Asegura que el ID es un UUID
    @Req() req: Request,
  ): Promise<{success: boolean, message: string}> {
    return await this.groupsService.remove(groupId, req.user?.id)
  }

}
