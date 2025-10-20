// sync-db.ts

import 'dotenv/config';
import { DataSource } from 'typeorm';
import { AppDataSource } from './src/config/typeorm';

async function syncDatabase() {
  console.log('Iniciando script de SINCRONIZACIÓN de ESQUEMA...');

  // 1. Clonar la configuración base de TypeORM
  const config = {
    ...AppDataSource.options,

    // 2. 💡 FORZAR: Establecer synchronize: true para este script,
    //    independientemente de lo que esté en src/config/typeorm.ts
    synchronize: true,
  };

  // 3. Crear una nueva instancia de DataSource con la configuración modificada
  const syncDataSource = new DataSource(config);

  try {
    console.log(
      'Conectando a la base de datos y creando/actualizando tablas...',
    );

    // 4. Inicializar y ejecutar la sincronización
    const dataSource = await syncDataSource.initialize();
    await dataSource.synchronize(true); // Ejecuta la sincronización (TypeORM crea las tablas)

    console.log(
      '✅ ESQUEMA SINCRONIZADO. Las tablas están creadas/actualizadas en Supabase.',
    );
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error al sincronizar la base de datos:', error);
  }
}

syncDatabase();
