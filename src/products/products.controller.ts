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
  Query,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { ExternalProductDto } from './dto/external-product.dto';
import { ProductsDataService } from './products-data.service';
import { dateToArray } from '../shared/helpers/date.helper';
import { RoleGuard } from '../shared/guards/role.guard';
import { Product } from './db/products.entity';
import { ProductsQuery } from './queries/ProductsQuery';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsDataService) {}

  mapProductToExternal(product: Product): ExternalProductDto {
    return {
      ...product,
      createdAt: dateToArray(product.createdAt),
      updatedAt: dateToArray(product.updatedAt),
      tags: product.tags?.map((i) => i.name),
    };
  }

  @Get()
  async getAllProducts(
    @Query() query: ProductsQuery,
  ): Promise<Array<ExternalProductDto>> {
    return (await this.productService.getAllProducts(query)).map((i) =>
      this.mapProductToExternal(i),
    );
  }

  @Get(':id')
  async getProductById(@Param('id') _id_: string): Promise<ExternalProductDto> {
    return this.mapProductToExternal(
      await this.productService.getProductById(_id_),
    );
  }

  @Post()
  @UseGuards(RoleGuard)
  async addProduct(
    @Body() _product_: CreateProductDTO,
  ): Promise<ExternalProductDto> {
    return this.mapProductToExternal(
      await this.productService.addProduct(_product_),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteProduct(@Param('id') _id_: string): Promise<void> {
    await this.productService.deleteProductById(_id_);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') _id_: string,
    @Body() _product_: CreateProductDTO,
  ): Promise<ExternalProductDto> {
    return this.mapProductToExternal(
      await this.productService.updateProduct(_id_, _product_),
    );
  }
}
