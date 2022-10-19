import * as dotenv from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenv.config();

export const options: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306, // set your port here
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'shop',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  dropSchema: false,
  migrationsRun: false,
  migrations: [__dirname + '/db/migrations/**/*{.ts,.js}'],
  subscribers: [__dirname + '/db/subscribers/**/*{.ts,.js}'],
};

export const dataSource = new DataSource(options);
dataSource
  .initialize()
  .then((data) => {
    console.log('Data Source has been initialized!');
    if (process.env.MIGRATIONS_RUN === 'true') {
      data.runMigrations();
    }
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
