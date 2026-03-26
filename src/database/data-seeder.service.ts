import { Injectable, OnApplicationBootstrap, Logger } from '@nestjs/common';
import { RolesRepository } from '../modules/roles/roles.repository';

@Injectable()
export class DataSeederService implements OnApplicationBootstrap {
  private readonly logger = new Logger(DataSeederService.name);
  private readonly DEFAULT_ROLES = [
    { name: 'USER', description: 'Usuario básico del sistema' },
    { name: 'ADMIN', description: 'Administrador del sistema' },
    { name: 'SUPERADMIN', description: 'Superadministrador con control total' },
  ];

  constructor(private readonly rolesRepository: RolesRepository) {}

  async onApplicationBootstrap() {
    await this.seedDefaultRoles();
  }

  private async seedDefaultRoles() {
    this.logger.log('Verificando y sembrando roles por defecto...');

    for (const roleData of this.DEFAULT_ROLES) {
      const existingRole = await this.rolesRepository.findByName(
        roleData.name as 'USER' | 'ADMIN' | 'SUPERADMIN',
      );

      if (!existingRole) {
        try {
          const newRole = await this.rolesRepository.save(
            this.rolesRepository.create({
              name: roleData.name as 'USER' | 'ADMIN' | 'SUPERADMIN',
              description: roleData.description,
              is_active: true,
            }),
          );
          this.logger.log(
            `Rol "${newRole.name}" (ID: ${newRole.role_id}) sembrado exitosamente.`,
          );
        } catch (error: any) {
          this.logger.error(
            `Error creando rol "${roleData.name}": ${error.message}`,
          );
        }
      } else {
        this.logger.debug(`Rol "${roleData.name}" ya existe.`);
      }
    }
  }
}
