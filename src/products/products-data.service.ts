import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { Product } from '../products/interfaces/product.inteface';
import { UpdateProductDTO } from './dto/update-product.dto';

@Injectable()
export class ProductsDataService {
  private _products_: Product[] = [];

  addProduct(newProduct: CreateProductDTO): Product {
    const product: Product = {
      id: this._products_.length.toString(),
      ...newProduct,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._products_.push(product);

    return product;
  }

  updateProduct(id: string, product: UpdateProductDTO): Product {
    this._products_.map((item) => {
      if (item.id === id) {
        return {
          ...product,
          id: item.id,
          createdAt: item.createdAt,
          updatedAt: new Date(),
        };
      }
      return item;
    });

    return this.getProductById(id);
  }

  getAllProducts(): Array<Product> {
    return this._products_;
  }

  getProductById(id: string): Product {
    return this._products_.find((item) => item.id === id);
  }

  deleteProductById(id: string): void {
    this._products_.filter((item) => item.id !== id);
  }
}
