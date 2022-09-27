export = {
  type: 'mysql',
  host: 'localhost',
  port: 3333, // set your port here
  username: 'root',
  password: 'Qwerty123#',
  database: 'shop',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};
