import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Body,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { ExternalProductDto } from './dto/external-product.dto';
import { ProductsDataService } from './products-data.service';
import { Product } from './interfaces/product.inteface';
import { dateToArray, arrayToDate } from '../helpers/date.helper';

@Controller('products')
export class ProductsController {
  constructor(private productRepository: ProductsDataService) {}
  @Get(':id')
  getProductById(@Param('id') _id_: string): string {
    return `GetById ${_id_}`;
  }

  @Get()
  getAllProducts(): string {
    return 'GetAll';
  }

  @Post()
  addIProduct(@Body() _product_: CreateProductDTO): ExternalProductDto {
    return this.mapProductToExternal(
      this.productRepository.addProduct(_product_),
    );
  }

  mapProductToExternal(product: Product): ExternalProductDto {
    return {
      ...product,
      createdAt: dateToArray(product.createdAt),
      updatedAt: dateToArray(product.updatedAt),
    };
  }

  @Delete(':id')
  deleteProduct(@Param('id') _id_: string): string {
    return `Delete ${_id_}`;
  }

  @Put(':id')
  updateProduct(
    @Param('id') _id_: string,
    @Body() _product_: CreateProductDTO,
  ): ExternalProductDto {
    return null;
  }
}
