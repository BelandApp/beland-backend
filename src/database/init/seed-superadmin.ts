import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import * as dotenv from 'dotenv';
import { Logger } from '@nestjs/common';
import { SuperAdminUserSeeder } from './seeders/superadmin-user.seeder';

dotenv.config();

async function bootstrap() {
  const logger = new Logger('SuperadminSeederScript');
  logger.log('🚀 Iniciando script para el seeder del Superadmin...');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const superAdminUserSeeder = app.get(SuperAdminUserSeeder);
    await superAdminUserSeeder.seed();
    logger.log('✅ Proceso del seeder del Superadmin completado exitosamente.');
  } catch (error: any) {
    logger.error(
      `❌ Error durante la ejecución del seeder manual: ${error.message}`,
      error.stack,
    );
  } finally {
    await app.close();
  }
}

void bootstrap();
