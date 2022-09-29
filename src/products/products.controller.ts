import {
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Put,
  Body,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { ExternalProductDto } from './dto/external-product.dto';
import { ProductsDataService } from './products-data.service';
import { dateToArray } from '../shared/helpers/date.helper';
import { RoleGuard } from '../shared/guards/role.guard';
import { Product } from './db/products.entity';

@Controller('products')
export class ProductsController {
  constructor(private productRepository: ProductsDataService) {}

  mapProductToExternal(product: Product): ExternalProductDto {
    return {
      ...product,
      createdAt: dateToArray(product.createdAt),
      updatedAt: dateToArray(product.updatedAt),
      tags: product.tags?.map((i) => i.name),
    };
  }

  @Get()
  async getAllProducts(): Promise<Array<ExternalProductDto>> {
    const products = await this.productRepository.getAllProducts();
    return products.map((i) => this.mapProductToExternal(i));
  }

  @Get(':id')
  async getProductById(@Param('id') _id_: string): Promise<ExternalProductDto> {
    return this.mapProductToExternal(
      await this.productRepository.getProductById(_id_),
    );
  }

  @Post()
  @UseGuards(RoleGuard)
  async addProduct(
    @Body() _product_: CreateProductDTO,
  ): Promise<ExternalProductDto> {
    return this.mapProductToExternal(
      await this.productRepository.addProduct(_product_),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id') _id_: string): Promise<void> {
    await this.productRepository.deleteProductById(_id_);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') _id_: string,
    @Body() _product_: CreateProductDTO,
  ): Promise<ExternalProductDto> {
    return this.mapProductToExternal(
      await this.productRepository.updateProduct(_id_, _product_),
    );
  }
}
