import dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { logger } from '../helpers/logger';
import { entities } from '../entities';

dotenv.config();

export const DataSourceInstance = new DataSource({
  host: process.env.DB_HOST || '',
  port: parseInt(process.env.DB_PORT ?? '', 10),
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || '',
  type: 'mysql',
  synchronize: true,
  logging: ['error'],
  subscribers: [],
  migrations: [],
  entities: entities,
});