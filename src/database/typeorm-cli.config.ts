import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const isTs = process.env.NODE_ENV !== 'production';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  ssl: isTs ? false : { rejectUnauthorized: false },
});
