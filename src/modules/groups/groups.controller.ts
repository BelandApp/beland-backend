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

@ApiTags('groups') // Etiqueta para la documentación de Swagger
@Controller('groups')
// Importante: NO HAY @UseGuards a nivel de controlador. Se aplicarán de forma granular.
export class GroupsController {

  constructor(
    private readonly groupsService: GroupsService,
  ) {}

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

  // --- RUTAS PROTEGIDAS: Gestión de Miembros de Grupo ---

  /*@Post(':groupId/members')
  @ApiOperation({
    summary: 'Invita a un usuario a un grupo',
    description:
      'Permite al líder del grupo o a un administrador invitar a un usuario a un grupo. El usuario se puede especificar por email, username o teléfono. El usuario invitado se añadirá como MIEMBRO.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'groupId',
    description: 'ID del grupo al que invitar',
    type: String,
  })
  @ApiBody({ type: InviteUserDto })
  @ApiResponse({
    status: 201,
    description: 'Invitación enviada exitosamente.',
    type: GroupInvitationDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Datos de entrada inválidos o usuario ya es miembro.',
  })
  @ApiResponse({ status: 401, description: 'No autenticado.' })
  @ApiResponse({
    status: 403,
    description: 'No autorizado para enviar invitaciones a este grupo.',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo o usuario invitado no encontrado.',
  })
  @ApiResponse({
    status: 409,
    description:
      'Ya existe una invitación pendiente para este usuario o el usuario ya es miembro.',
  })
  async inviteUser(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Body(ValidationPipe) inviteUserDto: InviteUserDto,
    @Req() req: Request,
  ): Promise<GroupInvitationDto> {
    const currentUserId = req.user?.id;
    this.logger.log(
      `🚧 [BACKEND] Ruta /groups/:groupId/members - Enviando invitación al grupo ${groupId} por el usuario ${currentUserId}`,
    );

    try {
      const group = await this.groupsService.findGroupById(groupId);

      const isCurrentUserLeader = group.user?.id === currentUserId;
      const currentUserRole = (req.user as User)?.role_name;
      const isCurrentUserAdminOrSuperAdmin =
        currentUserRole === 'ADMIN' || currentUserRole === 'SUPERADMIN';

      if (!isCurrentUserLeader && !isCurrentUserAdminOrSuperAdmin) {
        throw new ForbiddenException(
          'Solo el líder del grupo o un administrador pueden invitar miembros a este grupo.',
        );
      }

      return await this.groupsService.inviteUserToGroup(
        groupId,
        inviteUserDto,
        currentUserId,
      );
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException ||
        error instanceof BadRequestException ||
        error instanceof ForbiddenException
      ) {
        this.logger.warn(
          `inviteUser(): Error al enviar invitación: ${
            (error as Error).message
          }`,
        );
        throw error;
      }
      this.logger.error(
        `inviteUser(): Internal server error al enviar invitación: ${
          (error as Error).message
        }`,
        (error as Error).stack,
      );
      throw new InternalServerErrorException(
        'Fallo al enviar la invitación debido a un error interno.',
      );
    }
  }

  @Get(':groupId/members')
  @UseGuards(FlexibleAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('LEADER', 'ADMIN', 'SUPERADMIN', 'USER', 'EMPRESA')
  @ApiOperation({
    summary: 'Obtener todos los miembros de un grupo específico',
    description:
      'Recupera una lista de todos los miembros para un grupo dado. Accesible por el líder del grupo, cualquier miembro del grupo o un Administrador/Superadministrador.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({
    name: 'groupId',
    description: 'ID del grupo del que recuperar los miembros.',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de miembros del grupo.',
    type: [GroupMemberDto],
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 403,
    description:
      'Prohibido (no autorizado para ver los miembros de este grupo).',
  })
  @ApiResponse({ status: 404, description: 'Grupo no encontrado.' })
  async getMembers(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Req() req: Request,
  ): Promise<GroupMemberDto[]> {
    const userId = req.user?.id;
    this.logger.log(
      `🚧 [BACKEND] Ruta /groups/:groupId/members - Obteniendo miembros para el grupo ${groupId} por el usuario ${userId}`,
    );
    try {
      const group = await this.groupsService.findGroupById(groupId);

      const isCurrentUserLeader = group.user?.id === userId;
      const isCurrentUserMember = group.members?.some(
        (member) => member.user?.id === userId,
      );
      const currentUserRole = (req.user as User)?.role_name;
      const isCurrentUserAdminOrSuperAdmin =
        currentUserRole === 'ADMIN' || currentUserRole === 'SUPERADMIN';

      if (
        !isCurrentUserLeader &&
        !isCurrentUserMember &&
        !isCurrentUserAdminOrSuperAdmin
      ) {
        throw new ForbiddenException(
          'No tienes autorización para ver los miembros de este grupo. Debes ser el líder, un miembro o un administrador.',
        );
      }

      const members = await this.groupsService.getGroupMembers(groupId);
      return members;
    } catch (error) {
      this.handleError(error, 'obtener miembros del grupo');
    }
  }

  @Patch(':groupId/members/:memberId')
  @UseGuards(FlexibleAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('LEADER', 'ADMIN', 'SUPERADMIN')
  @RequiredPermissions('user_permission')
  @ApiOperation({
    summary: 'Actualizar un miembro de un grupo (ej. cambiar rol)',
    description:
      'Actualiza un miembro específico de un grupo. Solo el líder del grupo o un Admin/Superadmin puede realizar esta acción.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'groupId', description: 'ID del grupo.', type: String })
  @ApiParam({
    name: 'memberId',
    description: 'ID de la entrada del miembro del grupo.',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Miembro del grupo actualizado exitosamente.',
    type: GroupMemberDto,
  })
  @ApiResponse({ status: 400, description: 'Datos de entrada inválidos.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Prohibido (no autorizado para actualizar este miembro).',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo o miembro del grupo no encontrado.',
  })
  async updateMember(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Body() updateGroupMemberDto: UpdateGroupMemberDto,
    @Req() req: Request,
  ): Promise<GroupMemberDto> {
    const currentUserId = req.user?.id;
    this.logger.log(
      `🚧 [BACKEND] Ruta /groups/:groupId/members/:memberId - Actualizando miembro ${memberId} en el grupo ${groupId} por el usuario ${currentUserId}`,
    );
    try {
      const group = await this.groupsService.findGroupById(groupId);

      const isCurrentUserLeader = group.user?.id === currentUserId;
      const currentUserRole = (req.user as User)?.role_name;
      const isCurrentUserAdminOrSuperAdmin =
        currentUserRole === 'ADMIN' || currentUserRole === 'SUPERADMIN';

      if (!isCurrentUserLeader && !isCurrentUserAdminOrSuperAdmin) {
        throw new ForbiddenException(
          'Solo el líder del grupo o un administrador pueden actualizar miembros del grupo.',
        );
      }

      const updatedMember = await this.groupsService.updateGroupMemberRole(
        memberId,
        updateGroupMemberDto,
      );
      return updatedMember;
    } catch (error) {
      this.handleError(error, 'actualizar miembro del grupo');
    }
  }

  @Delete(':groupId/members/:memberId')
  @UseGuards(FlexibleAuthGuard, RolesGuard, PermissionsGuard)
  @Roles('LEADER', 'ADMIN', 'SUPERADMIN')
  @RequiredPermissions('user_permission')
  @ApiOperation({
    summary: 'Eliminar un miembro de un grupo',
    description:
      'Elimina un miembro específico de un grupo. Solo el líder del grupo o un Admin/Superadmin puede realizar esta acción. No se puede eliminar directamente al último líder de un grupo activo.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiParam({ name: 'groupId', description: 'ID del grupo.', type: String })
  @ApiParam({
    name: 'memberId',
    description: 'ID de la entrada del miembro del grupo a eliminar.',
    type: String,
  })
  @ApiResponse({
    status: 204,
    description: 'Miembro del grupo eliminado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'No se puede eliminar al último líder de un grupo activo.',
  })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({
    status: 403,
    description: 'Prohibido (no autorizado para eliminar a este miembro).',
  })
  @ApiResponse({
    status: 404,
    description: 'Grupo o miembro del grupo no encontrado.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(
    @Param('groupId', ParseUUIDPipe) groupId: string,
    @Param('memberId', ParseUUIDPipe) memberId: string,
    @Req() req: Request,
  ): Promise<void> {
    const currentUserId = req.user?.id;
    this.logger.log(
      `🚧 [BACKEND] Ruta /groups/:groupId/members/:memberId - Eliminando miembro ${memberId} del grupo ${groupId} por el usuario ${currentUserId}`,
    );
    try {
      const group = await this.groupsService.findGroupById(groupId);

      const isCurrentUserLeader = group.user?.id === currentUserId;
      const currentUserRole = (req.user as User)?.role_name;
      const isCurrentUserAdminOrSuperAdmin =
        currentUserRole === 'ADMIN' || currentUserRole === 'SUPERADMIN';

      if (!isCurrentUserLeader && !isCurrentUserAdminOrSuperAdmin) {
        throw new ForbiddenException(
          'Solo el líder del grupo o un administrador pueden eliminar miembros de este grupo.',
        );
      }

      await this.groupsService.removeGroupMember(memberId);
    } catch (error) {
      this.handleError(error, 'eliminar miembro del grupo');
    }
  }*/
}
