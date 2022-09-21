import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from '../products/interfaces/product.inteface';

@Injectable()
export class ProductsDataService {
  private _products_: Product[] = [];

  addProduct(newProduct: CreateProductDTO) {
    const product: Product = {
      id: this._products_.length.toString(),
      ...newProduct,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._products_.push(product);
  }
}
