// src/group-services/group-services.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Req,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { GroupServicesService } from './group-services.service';
import { CreateGroupServiceDto } from './dto/create-group-service.dto';
import { UpdateGroupServiceDto } from './dto/update-group-service.dto';
import { GroupService } from './entities/group-service.entity';
import { FlexibleAuthGuard } from '../auth/guards/flexible-auth.guard';

@ApiTags('Group Services')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
@Controller('group-services')
export class GroupServicesController {
  constructor(
    private readonly groupServicesService: GroupServicesService,
  ) {}

  /* ======================================================
   * FIND ALL
   * ====================================================== */
  @Get()
  @ApiOperation({ summary: 'Listar servicios de grupos' })
  async findAll(): Promise<GroupService[]> {
    return this.groupServicesService.findAll();
  }

  @Get('group/:group_id')
  @ApiOperation({ summary: 'Listar servicios de u grupo individual' })
  @ApiParam({ name: 'group_id', format: 'uuid' })
  async findAllGroup(@Param('group_id', ParseUUIDPipe) group_id: string,): Promise<GroupService[]> {
    return this.groupServicesService.findAllGroup(group_id);
  }
  /* ======================================================
   * FIND ONE
   * ====================================================== */
  @Get(':id')
  @ApiOperation({ summary: 'Obtener servicio de grupo por ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GroupService> {
    return this.groupServicesService.findOne(id);
  }

  /* ======================================================
   * UPDATE
   * ====================================================== */
  @Put(':id')
  @ApiOperation({ summary: 'Actualizar servicio del grupo' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGroupServiceDto,
  ): Promise<GroupService> {
    return this.groupServicesService.update(id, dto);
  }

  /* ======================================================
   * DELETE
   * ====================================================== */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Eliminar servicio del grupo' })
  @ApiParam({ name: 'id', format: 'uuid' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ success: boolean }> {
    return this.groupServicesService.remove(id);
  }

  /* ======================================================
   * CREATE
   * ====================================================== */
  @Post()
  @ApiOperation({ summary: 'Crear un servicio para un grupo' })
  @ApiResponse({ status: 201, type: GroupService })
  async create(
    @Body() dto: CreateGroupServiceDto,
    @Req() req: Request,
  ): Promise<GroupService> {
    const user_id = req.user.id;
    return this.groupServicesService.create(dto, user_id);
  }

  /* ======================================================
   * COMPLETE SERVICE
   * ====================================================== */
  @Post('complete/:id')
  @ApiOperation({
    summary:
      'Completar servicio y liberar saldos (cobra al creador del grupo y paga al superadmin)',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  async completeService(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<GroupService> {
    return this.groupServicesService.completeService(id);
  }

  @Post('cancelled/:id')
  @ApiOperation({
    summary:
      'Cancelar servicio y liberar saldos (cobra al grupo y paga al superadmin)',
  })
  @ApiParam({ name: 'id', format: 'uuid' })
  async cancelledService(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{message: string, success: true}> {
    return this.groupServicesService.cancelledService(id);
  }
}
