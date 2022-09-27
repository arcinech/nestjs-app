import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsDataService } from './products-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagRepository } from './db/tag.repository';

@Module({
  controllers: [ProductsController],
  providers: [ProductsDataService],
  imports: [TypeOrmModule.forFeature([TagRepository])],
})
export class ProductsModule {}
