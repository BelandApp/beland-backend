// src/group-members/group-members.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { CreateGroupMemberDto, CreateManyGroupMemberDto } from './dto/create-group-member.dto'; 
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Request } from 'express'; // Import Request from express for req.user
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard';
import { GroupMember } from './entities/group-member.entity';

@ApiTags('group-members')
@Controller('group-members')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class GroupMembersController {
  constructor(
    private readonly service: GroupMembersService,
  ) { }

  // NOTE: Creation of group members is primarily handled by GroupsController (create group, invite user).
  // This controller focuses on managing existing individual memberships.

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Obtener todos los miembros de un grupo' })
  async findByGroup(@Param('groupId') groupId: string): Promise<GroupMember[]> {
    const members = await this.service.findAllByGroupId(groupId);
    return members;
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Obtener todos los grupos de un usuario' })
  async findByUser(@Param('userId') userId: string): Promise<GroupMember[]> {
    const members = await this.service.findGroupsByUserId(userId);
    return members;
  }

  @Get('group-and-user')
  @ApiOperation({ summary: 'Obtener todos los miembros de un grupo por ID de Grupo e ID de Usuario' })
  async findOneByGroupAndUser(
    @Query('groupId') groupId: string,
    @Query('userId') userId: string,
    @Req() req: Request
  ): Promise<GroupMember> {
    const member = await this.service.findOneByGroupAndUser(groupId, userId);
    return member;
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener una membresía de grupo por ID',
    description: 'Recupera los detalles de una membresía de grupo específica. Accesible por cualquier miembro del grupo asociado con la membresía, o por un Admin/Superadmin.',
  })
  @ApiParam({ name: 'id', description: 'El ID único de la membresía de grupo a recuperar', type: String, })
  @ApiResponse({ status: 200, description: 'Membresía encontrada.' })
  @ApiResponse({ status: 401, description: 'No autorizado.' })
  @ApiResponse({ status: 403, description: 'Prohibido (el usuario actual no es miembro del grupo y no es Admin/Superadmin).', })
  @ApiResponse({ status: 404, description: 'Membresía no encontrada.' })
  async findOne(@Param('id') id: string): Promise<GroupMember> {
    return await this.service.findOne(id)
  }

  @Post()
  @ApiOperation({ summary: 'Agregar un miembro a un grupo' })
  @ApiResponse({ status: 201, description: 'Miembro agregado exitosamente.' })
  async create(@Body() createDto: CreateGroupMemberDto, @Req() req: Request): Promise<GroupMember> {
    // Assuming createDto is valid (CreateGroupMemberDto)
    return await this.service.createGroupMember(createDto)
  }

  @Post('many')
  @ApiOperation({ summary: 'Agregar varios miembros a un grupo' })
  @ApiResponse({ status: 201, description: 'Miembros agregados exitosamente.' })
  async createMany(@Body() createDto: CreateManyGroupMemberDto, @Req() req: Request): Promise<{ message: string; success: true }> {
    // Assuming createDto is valid (CreateGroupMemberDto)
    return await this.service.createMany(createDto, req.user?.id)
  }

  @Delete('group-and-user')
  @ApiOperation({ summary: 'Eliminar un miembro por ID de Grupo e ID de Usuario. Solo Creador o mismo miembro a eliminar pueden realizar esta acción.' })
  @ApiQuery({ name: 'groupId', description: 'El ID del grupo', required: true })
  @ApiQuery({ name: 'userId', description: 'El ID del usuario', required: true })
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeByGroupAndUser(
    @Query('groupId') groupId: string,
    @Query('userId') userId: string,
    @Req() req: Request
  ): Promise<{message: string, success: boolean}> {
    return await this.service.removeMemberByGroupAndUser(groupId, userId, req.user?.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un miembro del grupo por ID. Solo Creador o mismo miembro a eliminar pueden realizar esta acción.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @Req() req: Request): Promise<{message: string, success: boolean}> {
    return await this.service.deleteGroupMember(id, req.user?.id);
  }
}
