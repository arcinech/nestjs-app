import { DataSource, DataSourceOptions } from 'typeorm';

export const options: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3333, // set your port here
  username: 'root',
  password: 'Qwerty123#',
  database: 'shop',
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
  .then(() => {
    console.log('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization', err);
  });
