// src/group-member-consumptions/group-member-consumptions.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
  Req,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GroupMemberConsumptionsService } from './group-members-consumption.service';
import { GroupMemberConsumptionFiltersDto } from './dto/group-member-consumption-filters.dto';
import {
  CreateGroupMemberConsumptionDto,
  CreateManyGroupMemberConsumptionDto,
} from './dto/create-group-members-consumption.dto';
import { UpdateGroupMemberConsumptionDto } from './dto/update-group-members-consumption.dto';
import { Request } from 'express';
import { FlexibleAuthGuard } from '../auth/guards/flexible-auth.guard';
import { GroupMemberConsumption } from './entities/group-members-consumption.entity';

@ApiTags('group-member-consumptions')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
@Controller('group-member-consumptions')
export class GroupMemberConsumptionsController {
  constructor(
    private readonly service: GroupMemberConsumptionsService,
  ) {}

  // ==============================
  // FIND ALL (PAGINADO + FILTROS)
  // ==============================
  @Get()
  @ApiOperation({ summary: 'Obtener consumos con filtros y paginación' })
  findAll(
    @Query() filters: GroupMemberConsumptionFiltersDto,
  ) {
    return this.service.findAll(filters);
  }

  // ==============================
  // AGRUPADO POR PRODUCTO
  // ==============================
  @Get('summary-product/:group_id')
  @ApiOperation({
    summary:
      'Resumen de consumos por producto dentro de un grupo',
  })
  findGroupedByProduct(
    @Param('group_id', ParseUUIDPipe) group_id: string,
  ): Promise<Array<{
      product_id: string;
      product_name: string;
      product_image_url: string | null;
      total_consumers: number;
    }>> {
    return this.service.findGroupedByProduct(group_id);
  }

  // ==============================
  // FIND BY USER
  // ==============================
  @Get('user-consumptions/:group_id')
  @ApiOperation({ summary: 'Obtener los consumos el usuario por id del grupo' })
  findUserConsumptions(
    @Param('group_id', ParseUUIDPipe) group_id: string,
    @Req() req: Request,
  ): Promise<GroupMemberConsumption[]> {
    return this.service.findUserConsumptions(group_id, req.user?.id);
  }

  // ==============================
  // FIND ONE
  // ==============================
  @Get(':id')
  @ApiOperation({ summary: 'Obtener un consumo por ID' })
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.findOne(id);
  }

  // ==============================
  // CREATE ONE
  // ==============================
  @Post()
  @ApiOperation({ summary: 'Crear un consumo individual' })
  createOne(
    @Body() dto: CreateGroupMemberConsumptionDto,
    @Req() req: Request,
  ) {
    return this.service.createOne(dto, req.user?.id);
  }

  // ==============================
  // CREATE MANY
  // ==============================
  @Post('create-many')
  @ApiOperation({
    summary:
      'Crear múltiples consumos para el usuario autenticado',
  })
  createMany(
    @Body() dto: CreateManyGroupMemberConsumptionDto,
    @Req() req: Request,
  ) {
    return this.service.createMany(dto, req.user?.id);
  }

  // ==============================
  // UPDATE
  // ==============================
  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un consumo' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateGroupMemberConsumptionDto,
  ) {
    return this.service.update(id, dto);
  }

  // ==============================
  // DELETE
  // ==============================
  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un consumo' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.service.remove(id);
  }
}
