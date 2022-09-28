import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsDataService } from './products-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './db/tag.repository';
import { ProductRepository } from './db/products.repository';

@Module({
  controllers: [ProductsController],
  providers: [ProductsDataService],
  imports: [
    TypeOrmModule.forFeature([TagRepository]),
    TypeOrmModule.forFeature([ProductRepository]),
  ],
})
export class ProductsModule {}
