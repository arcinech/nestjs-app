import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsDataService } from './products-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './db/tag.repository';
import { ProductRepository } from './db/products.repository';

@Module({
  controllers: [ProductsController],
  providers: [ProductsDataService, ProductRepository, TagRepository],
  imports: [TypeOrmModule.forFeature([TagRepository, ProductRepository])],
})
export class ProductsModule {}
