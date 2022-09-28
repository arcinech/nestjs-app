import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductRepository } from './db/products.repository';
import { TagRepository } from './db/tag.repository';
import { Product } from './db/products.entity';
import { Tag } from './db/tag.entity';

@Injectable()
export class ProductsDataService {
  constructor(
    private productRepository: ProductRepository,
    private tagRepository: TagRepository,
  ) {}

  async addProduct(newProduct: CreateProductDTO): Promise<Product> {
    const tags: Tag[] = await this.tagRepository.findTagsByName(
      newProduct.tags,
    );
    const productToSave = new Product();
    productToSave.name = newProduct.name;
    productToSave.count = newProduct.count;
    productToSave.price = newProduct.price;
    productToSave.tags = tags;

    return this.productRepository.save(productToSave);
  }

  async updateProduct(id: string, product: UpdateProductDTO): Promise<Product> {
    const tags: Tag[] = await this.tagRepository.findTagsByName(product.tags);
    const productToUpdate = await this.getProductById(id);

    productToUpdate.name = product.name;
    productToUpdate.price = product.price;
    productToUpdate.count = product.count;
    productToUpdate.tags = tags;

    await this.productRepository.save(productToUpdate);

    return this.getProductById(id);
  }

  async deleteProductById(id: string): Promise<void> {
    this.productRepository.delete(id);
  }

  getAllProducts(): Promise<Product[]> {
    return this.productRepository.find();
  }

  getProductById(id: string): Promise<Product> {
    // findOne changed to findOneBy in typeorm ^0.3.0
    return this.productRepository.findOneBy({ id: id });
  }
}
