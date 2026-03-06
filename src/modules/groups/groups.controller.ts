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
  Put,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
  UploadedFile,
  Patch, // Importar ValidationPipe
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
  ApiBody,
  ApiConsumes, // Para documentar el cuerpo de la solicitud en Swagger
} from '@nestjs/swagger';
// Rutas absolutas para guards y decoradores
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { Request } from 'express'; 
import { Group } from './entities/group.entity';
import { GetGroupsQueryDto } from './dto/filters-groups.dto';
import { RespGetTypeDto } from 'src/dto/resp-app.dto';
import { GroupPrivacy } from './entities/group-privacy.entity';
import { UserAddress } from '../user-address/entities/user-address.entity';
import { GroupType } from '../group-type/entities/group-type.entity';
import { PaymentType } from '../payment-types/entities/payment-type.entity';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';

@ApiTags('groups') // Etiqueta para la documentación de Swagger
@Controller('groups')
// Importante: NO HAY @UseGuards a nivel de controlador. Se aplicarán de forma granular.
export class GroupsController {

  constructor(
    private readonly groupsService: GroupsService,
  ) {}

  // src/groups/groups.controller.ts

  @Get()
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

  @Get('privacy-type')
  @ApiOperation({
    summary:'Obtener todos tipos de provacidad de grupo'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({status: 200,description:'Lista de tipos de ´rivacidad de grupos'})
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getGroupsPrivacy(): Promise<RespGetTypeDto<GroupPrivacy>> {
    return await this.groupsService.getGroupPrivacy();
  }

  @Get('info-create')
  @UseGuards(FlexibleAuthGuard) // Solo requiere autenticación
  @ApiOperation({
    summary:'Todas las relaciones para crear un grupo'
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({status: 200,description:'Listas de campos necesarios para la creacion'})
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  async getInfoCreate(): Promise<{
    user_address: UserAddress[],
    group_types: GroupType[],
    group_privacies: GroupPrivacy[],
    payment_types: PaymentType[]
  }> {
    return await this.groupsService.getInfoCreate();
  }

  @Get('by-user')
  @UseGuards(FlexibleAuthGuard) // Solo requiere autenticación
  @ApiOperation({
    summary:'Obtener todos los grupos a los que pertenece el usuario autenticado como miembro.',
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

  @Get('user-created')
  @UseGuards(FlexibleAuthGuard) // Solo requiere autenticación
  @ApiOperation({
    summary:'Obtener todos los grupos creados por el usuario.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiResponse({status: 200,description:'Lista de grupos creados por el usuario.'})
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({status: 403,description: 'Prohibido (ID de usuario no encontrado).'})
  @ApiResponse({ status: 500, description: 'Error interno del servidor.' })
  @ApiQuery({name: 'is_active', required: false, type: Boolean, description:'Filtrar grupos activos'})
  async getGroupsCreatedByUserId(@Req() req: Request, @Query('is_active') is_active: boolean): Promise<Group[]> {
    return await this.groupsService.getGroupsCreatedByUserId(req.user?.id, is_active);
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

  @Patch('image/:id')
  @UseGuards(FlexibleAuthGuard)
  @UseInterceptors(
    FileInterceptor('image')
  )
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Actualizar imagen del grupo' })
  @ApiBearerAuth('JWT-auth')
  @HttpCode(HttpStatus.OK)
  async updateGroupImage(
    @Param('id') groupId: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<Group> {

    if (!file) {
      throw new BadRequestException('Debe enviar una imagen');
    }

    if (!/^image\/(jpeg|jpg|png|webp)$/.test(file.mimetype)) {
      throw new BadRequestException('Formato de imagen inválido');
    }

    if (file.size > 10_000_000) {
      throw new BadRequestException('La imagen supera los 10 MB');
    }

    return this.groupsService.updateGroupImage(
      groupId,
      file,
      req.user.id,
    );
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
