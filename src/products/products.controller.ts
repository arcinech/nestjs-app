import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Body,
  HttpCode,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { ExternalProductDto } from './dto/external-product.dto';
import { ProductsDataService } from './products-data.service';
import { Product } from './interfaces/product.inteface';
import { dateToArray } from '../helpers/date.helper';

@Controller('products')
export class ProductsController {
  constructor(private productRepository: ProductsDataService) {}

  mapProductToExternal(product: Product): ExternalProductDto {
    return {
      ...product,
      createdAt: dateToArray(product.createdAt),
      updatedAt: dateToArray(product.updatedAt),
    };
  }

  @Get()
  getAllProducts(): Array<ExternalProductDto> {
    return this.productRepository
      .getAllProducts()
      .map((item) => this.mapProductToExternal(item));
  }

  @Get(':id')
  getProductById(@Param('id') _id_: string): ExternalProductDto {
    return this.mapProductToExternal(
      this.productRepository.getProductById(_id_),
    );
  }

  @Post()
  addIProduct(@Body() _product_: CreateProductDTO): ExternalProductDto {
    return this.mapProductToExternal(
      this.productRepository.addProduct(_product_),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  deleteProduct(@Param('id') _id_: string): void {
    this.productRepository.deleteProductById(_id_);
  }

  @Put(':id')
  updateProduct(
    @Param('id') _id_: string,
    @Body() _product_: CreateProductDTO,
  ): ExternalProductDto {
    return this.mapProductToExternal(
      this.productRepository.updateProduct(_id_, _product_),
    );
  }
}
