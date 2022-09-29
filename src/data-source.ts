import { DataSource, DataSourceOptions } from 'typeorm';
import { User } from './users/db/user.entity';
import { UserAddress } from './users/db/userAddress.entity';
import { Product } from './products/db/products.entity';
import { Tag } from './products/db/tag.entity';

export const options: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3333, // set your port here
  username: 'root',
  password: 'Qwerty123#',
  database: 'shop',
  // entities: [User, UserAddress, Product, Tag],
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
};

export const dataSource = new DataSource(options);
