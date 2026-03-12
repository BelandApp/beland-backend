import {
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ForbiddenException,
  Body,
  Query,
  BadRequestException,
  Put,
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

  @Post('update-all-stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar stock global manualmente',
    description:
      'Actualiza el stock de todos los productos si la clave es correcta',
  })
  @ApiResponse({ status: 200, description: 'Stock actualizado correctamente' })
  @ApiResponse({ status: 403, description: 'Clave inválida' })
  async updateAllStock(
    @Query('quantity') quantity: string,
    @Query('secret') secret: string,
  ): Promise<{ success: boolean; message: string }> {

    if (secret !== 'ad12min345') {
      throw new ForbiddenException('Clave inválida');
    }

    const qty = Number(quantity);

    if (isNaN(qty) || qty < 0) {
      throw new BadRequestException('Cantidad inválida');
    }

    await this.service.updateAllStock(qty);

    return {
      success: true,
      message: 'Stock actualizado correctamente',
    };
  }

  @Post('update-transaction-ux')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Actualizar iconos y colores de transacciones',
    description:
      'Actualiza los campos icon y color en transaction_types y color en transaction_states usando los valores del seed',
  })
  @ApiResponse({ status: 200, description: 'Actualización exitosa' })
  @ApiResponse({ status: 500, description: 'Error en actualización' })
  async updateTransactionUX(): Promise<{
    success: boolean;
    updatedTypes: number;
    updatedStates: number;
  }> {
    const result = await this.service.updateTransactionUX();

    return {
      success: true,
      updatedTypes: result.updatedTypes,
      updatedStates: result.updatedStates,
    };
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
