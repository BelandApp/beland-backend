import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { FlexibleAuthGuard } from 'src/auth/guards/flexible-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { DatabaseInitService } from './database-init.service';

@ApiTags('database-init')
@Controller('database-init')
@ApiBearerAuth('JWT-auth')
@UseGuards(FlexibleAuthGuard, RolesGuard)
@Roles('SUPERADMIN')
export class DatabaseIntiController {
  constructor(private readonly service: DatabaseInitService) {}

  @Post('load-general')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear carga de datos iniciar y parcial', 
    description: 'Genera la carga de todos los datos necesarios para el funcionamiento de la app. Si los datos ya estan creados no lo vuelve a crear. Solo agrega los que faltan' })
  @ApiResponse({ status: 201, description: 'Creacion exitosa' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'No se pudo crear' })
  async dataEntryUpdate(): Promise<void> {
    return await this.service.dataInitEntryUpdate();
  }

  @Post('add-becoin-prod')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Agregar el precio en becoin a los productos', 
    description: 'Actualiza todos los productos de la bd cargandole su precio en becoin segun el price' })
  @ApiResponse({ status: 201, description: 'Actualizacion exitosa' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'No se pudo crear' })
  async addBecoinProd(): Promise<void> {
    return await this.service.addBecoinProd();
  }

  @Post('load-resource-user')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear carga de datos iniciar y parcial', 
    description: 'Genera la carga de todos los datos necesarios para el funcionamiento de la app. Si los datos ya estan creados no lo vuelve a crear. Solo agrega los que faltan' })
  @ApiResponse({ status: 201, description: 'Creacion exitosa' })
  @ApiQuery({ name: 'email', required: true, description: 'Email del usuario a Cargar los recursos' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'No se pudo crear' })
  async loadResourceByUser(@Query("email") email:string): Promise<void> {
    return await this.service.loadResourceByUser(email);
  }

  @Post('load-superadmin-and-roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Crear usuario SuperAdmin y todos los roles.', 
    description: 'Genera la carga de del usuario SuperAdmin. y todos los roles de usuario existentes' })
  @ApiResponse({ status: 201, description: 'Creacion exitosa' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'No se pudo crear' })
  async loadSuperAdminAndRole(): Promise<void> {
    return await this.service.loadSuperAdminAndRole();
  }
}
