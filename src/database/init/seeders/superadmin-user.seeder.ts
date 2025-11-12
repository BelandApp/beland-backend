import {
  Injectable,
  Logger,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../../modules/users/users.service';
import { CreateUserDto } from '../../../modules/users/dto/create-user.dto';
import { AuthService } from 'src/modules/auth/auth.service';
import { DataSource } from 'typeorm';
import { User } from 'src/modules/users/entities/users.entity';
import { Role } from 'src/modules/roles/entities/role.entity';
import { ROLES_KEY } from 'src/modules/auth/decorators/roles.decorator';
import { Wallet } from 'src/modules/wallets/entities/wallet.entity';
import { v4 as uuidv4 } from 'uuid';
import * as QRCode from 'qrcode';

@Injectable()
export class SuperAdminUserSeeder {
  private readonly logger = new Logger(SuperAdminUserSeeder.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    public dataSource: DataSource,
  ) {}

  /**
   * Siembra el usuario SUPERADMIN.
   * @param forceReset Si es true, fuerza la wallet del usuario existente a tener un alias y QR nulos.
   */
  async seed(forceReset: boolean = false): Promise<void> {
    this.logger.log('👑 Verificando y creando usuario SUPERADMIN...');

    const superAdminEmail = this.configService.get<string>('SUPERADMIN_EMAIL');
    const superAdminPassword = this.configService.get<string>(
      'SUPERADMIN_PASSWORD',
    );
    const superAdminFullName =
      this.configService.get<string>('SUPERADMIN_FULL_NAME') ||
      'Super Administrador';
    const superAdminUsername =
      this.configService.get<string>('SUPERADMIN_USERNAME') || 'superadmin';
    const superAdminAddress =
      this.configService.get<string>('SUPERADMIN_ADDRESS') ||
      'Av. Principal, Edif. Central, Piso 1';
    const superAdminPhone =
      this.configService.get<string>('SUPERADMIN_PHONE') || '+584140000000';
    const superAdminCountry =
      this.configService.get<string>('SUPERADMIN_COUNTRY') || 'Venezuela';
    const superAdminCity =
      this.configService.get<string>('SUPERADMIN_CITY') || 'Caracas';

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const role = await queryRunner.manager.findOne(Role, {
        where: { name: 'SUPERADMIN' },
      });

      if (!role) {
        this.logger.error(
          `❌ El rol 'SUPERADMIN' no se encontró. No se puede crear el usuario.`,
        );
        throw new InternalServerErrorException(
          'El rol SUPERADMIN no existe en la base de datos.',
        );
      }

      const existingUser = await this.usersService
        .findUserEntityByEmail(superAdminEmail)
        .catch(() => null);

      if (existingUser) {
        this.logger.log(
          `ℹ️ Usuario SUPERADMIN ya existe: ${superAdminEmail}. Verificando su wallet.`,
        );

        const superadminWallet = await queryRunner.manager.findOne(Wallet, {
          where: { user: { id: existingUser.id } },
        });

        if (!superadminWallet) {
          this.logger.error(
            '❌ La wallet del usuario SUPERADMIN no se encontró, intentando crearla.',
          );
          await this.authService.createWalletAndCart(queryRunner, existingUser);
          this.logger.log(
            '✅ Wallet y cart del SUPERADMIN creados exitosamente.',
          );
        } else {
          // ✅ NUEVA LÓGICA: Si forceReset es true, forzamos alias y QR a null
          if (forceReset) {
            superadminWallet.alias = null;
            superadminWallet.qr = null;
            await queryRunner.manager.save(Wallet, superadminWallet);
            this.logger.log(
              `✅ Se ha forzado el reinicio de la wallet del SUPERADMIN (alias y QR a NULL).`,
            );
          } else {
            // Lógica existente para verificar y actualizar si es necesario
            this.logger.debug(
              `🔍 Estado de la wallet: QR es nulo? ${!superadminWallet.qr}. Alias es 'BELAND'? ${
                superadminWallet.alias === 'BELAND'
              }.`,
            );

            if (!superadminWallet.qr || superadminWallet.alias !== 'BELAND') {
              const qrData = JSON.stringify({
                address: superadminWallet.address,
                alias: 'BELAND',
              });
              const newQr = await QRCode.toDataURL(qrData);

              // Siempre forzamos el alias a ser 'BELAND'
              superadminWallet.alias = 'BELAND';
              superadminWallet.qr = newQr;

              await queryRunner.manager.save(Wallet, superadminWallet);
              this.logger.log(
                '✅ QR y alias "BELAND" de la wallet del SUPERADMIN actualizados.',
              );
            } else {
              this.logger.log(
                '✅ QR y alias de la wallet del SUPERADMIN ya existen y son correctos. No se requiere acción.',
              );
            }
          }
        }
      } else {
        // Si el usuario no existe, proceder con la creación
        const superAdminData = {
          email: superAdminEmail,
          full_name: superAdminFullName,
          username: superAdminUsername,
          role_name: role.name,
          password: superAdminPassword,
          confirmPassword: superAdminPassword,
          address: superAdminAddress,
          phone: superAdminPhone,
          country: superAdminCountry,
          city: superAdminCity,
          isBlocked: false,
          deleted_at: null,
          profile_picture_url: '',
        };

        const newUser = await queryRunner.manager.save(User, {
          ...superAdminData,
          role_id: role.role_id,
        });

        // Llamar a la lógica de creación de wallet y cart
        await this.authService.createWalletAndCart(queryRunner, newUser);

        // ✅ Lógica agregada para setear el alias y QR inmediatamente después de la creación del usuario.
        const createdWallet = await queryRunner.manager.findOne(Wallet, {
          where: { user: { id: newUser.id } },
        });

        if (createdWallet) {
          createdWallet.alias = 'BELAND';
          const qrData = JSON.stringify({
            address: createdWallet.address,
            alias: 'BELAND',
          });
          createdWallet.qr = await QRCode.toDataURL(qrData);
          await queryRunner.manager.save(Wallet, createdWallet);
          this.logger.log(
            '✅ Wallet del SUPERADMIN inicializada con alias "BELAND" y QR.',
          );
        } else {
          this.logger.error('❌ La wallet recién creada no se encontró.');
        }

        this.logger.log(
          `✅ Usuario SUPERADMIN creado exitosamente: ${superAdminEmail}`,
        );
      }

      await queryRunner.commitTransaction();
    } catch (error: any) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `❌ Error durante la siembra del usuario SUPERADMIN:`,
        error.message,
        error.stack,
      );
      throw new InternalServerErrorException(
        `Error al crear o verificar el usuario SUPERADMIN: ${error.message}`,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
