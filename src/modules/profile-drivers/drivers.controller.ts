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
import { Driver } from './entities/driver.entity';
import { DriversService } from './drivers.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { FlexibleAuthGuard } from 'src/modules/auth/guards/flexible-auth.guard'; // Ajustar ruta si es necesario. En organizations es src/modules/auth/guards/flexible-auth.guard
import { DriverQueryDto } from './dto/driver-query.dto';
import { RespGetArrayDto, RespGetTypeDto } from 'src/dto/resp-app.dto';
import { Request } from 'express';
import { Vehicle } from './entities/vehicle.entity';

@ApiTags('drivers')
@Controller('drivers')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard)
export class DriversController {
    constructor(private readonly service: DriversService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
    summary: 'Listar conductores con filtros dinámicos, paginación y orden',
    })
    async findAll( @Query() query: DriverQueryDto ): Promise<RespGetArrayDto<Driver>> {
    return this.service.findAll(query);
    }

    @Get('vehicle-types')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
    summary: 'Listar todos los tipos de vehiculos para deliverys',
    })
    async findAllVehicleType(): Promise<RespGetTypeDto<Vehicle>> {
    return await this.service.findAllVehicleType();
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener un conductor por su ID' })
    @ApiParam({ name: 'id', description: 'UUID del conductor' })
    @ApiResponse({ status: 200, description: 'Conductor encontrado' })
    @ApiResponse({ status: 404, description: 'No se encontró el conductor' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Driver> {
        return await this.service.findOne(id);
    }

    @Get('user')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Obtener un conductor por su ID' })
    @ApiResponse({ status: 200, description: 'Conductor encontrado' })
    @ApiResponse({ status: 404, description: 'No se encontró el conductor' })
    @ApiResponse({ status: 500, description: 'Error interno del servidor' })
    async findByUser(@Req() req: Request): Promise<Driver> {
        return await this.service.findByUser(req.user?.id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: 'Crear un nuevo perfil de conductor' })
    @ApiResponse({ status: 201, description: 'Conductor creado exitosamente' })
    @ApiResponse({
        status: 400,
        description: 'Datos inválidos para crear el conductor',
    })
    @ApiResponse({ status: 500, description: 'No se pudo crear el conductor' })
    async create(@Body() body: CreateDriverDto): Promise<Driver> {
        // Cast to any or Partial<Driver> because DTO isn't exactly Entity but compatible enough for repository save
        return await this.service.create(body as unknown as Partial<Driver>);
    }

    @Put('disactive/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Dar de Baja un conductor y volver rol a USER' })
    @ApiParam({ name: 'id', description: 'UUID del conductor' })
    @ApiResponse({
        status: 200,
        description: 'Conductor desactivado correctamente',
    })
    @ApiResponse({
        status: 404,
        description: 'No se encontró el conductor a actualizar',
    })
    @ApiResponse({
        status: 500,
        description: 'Error al actualizar el conductor',
    })
    async disactiveDriver(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Driver> {
        return this.service.disactiveDriver(id);
    }

    @Put('active/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Activar un conductor y asignar perfil DRIVER' })
    @ApiParam({ name: 'id', description: 'UUID del conductor' })
    @ApiResponse({
        status: 200,
        description: 'Conductor activado correctamente',
    })
    @ApiResponse({
        status: 404,
        description: 'No se encontró el conductor a actualizar',
    })
    @ApiResponse({
        status: 500,
        description: 'Error al actualizar el conductor',
    })
    async activateDriver(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<Driver> {
        return this.service.activateDriver(id);
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Actualizar un perfil de conductor' })
    @ApiParam({ name: 'id', description: 'UUID del conductor' })
    @ApiResponse({
        status: 200,
        description: 'Conductor actualizado correctamente',
    })
    @ApiResponse({
        status: 404,
        description: 'No se encontró el conductor a actualizar',
    })
    @ApiResponse({
        status: 500,
        description: 'Error al actualizar el conductor',
    })
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() body: UpdateDriverDto,
    ) {
        return this.service.update(id, body);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Eliminar un conductor por su ID' })
    @ApiParam({ name: 'id', description: 'UUID del conductor' })
    @ApiResponse({
        status: 204,
        description: 'Conductor eliminado correctamente',
    })
    @ApiResponse({
        status: 404,
        description: 'No se encontró el conductor a eliminar',
    })
    @ApiResponse({
        status: 409,
        description: 'No se puede eliminar el conductor (conflicto)',
    })
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        await this.service.remove(id);
    }
}
