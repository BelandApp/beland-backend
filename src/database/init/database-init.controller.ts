import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { DatabaseInitService } from './database-init.service';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';

@ApiTags('database-init')
@Controller('database-init')
// @ApiBearerAuth('JWT-auth')
// @UseGuards(FlexibleAuthGuard, RolesGuard)
// @Roles('SUPERADMIN')
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

  /*@Post('quemar-becoin-manual')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ 
    summary: 'Quema 4000 becoin a Richard Gomez', })
  @ApiResponse({ status: 201, description: 'Creacion exitosa' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 500, description: 'No se pudo crear' })
  async quemaMAnual(): Promise<{wallet: Wallet, message: string}> {
    return await this.service.retiroManual();
  }*/

}
