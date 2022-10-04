import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsDataService } from './products-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tag } from './db/tag.entity';
import { Product } from './db/products.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsDataService, Product, Tag],
  imports: [
    TypeOrmModule.forFeature([Tag]),
    TypeOrmModule.forFeature([Product]),
  ],
})
export class ProductsModule {}
