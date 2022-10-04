import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product.dto';
import { UpdateProductDTO } from './dto/update-product.dto';
import { ProductRepository } from './db/products.repository';
import { TagRepository } from './db/tag.repository';
import { Product } from './db/products.entity';
import { dataSource } from 'src/data-source';
import { EntityManager } from 'typeorm';

@Injectable()
export class ProductsDataService {
  async addProduct(newProduct: CreateProductDTO): Promise<Product> {
    return dataSource.transaction(async (manager: EntityManager) => {
      const productToSave = new Product();

      productToSave.name = newProduct.name;
      productToSave.count = newProduct.count;
      productToSave.price = newProduct.price;
      productToSave.tags = await TagRepository.findTagsByName(newProduct.tags);

      return await manager.getRepository(Product).save(productToSave);
    });
  }

  async updateProduct(id: string, product: UpdateProductDTO): Promise<Product> {
    return dataSource.transaction(async (manager: EntityManager) => {
      const productToUpdate = await manager
        .getRepository(Product)
        .findOneBy({ id: id });

      productToUpdate.name = product.name;
      productToUpdate.count = product.count;
      productToUpdate.price = product.price;
      productToUpdate.tags = await TagRepository.findTagsByName(product.tags);

      return await manager.getRepository(Product).save(productToUpdate);
    });
  }

  async deleteProductById(id: string): Promise<void> {
    ProductRepository.delete(id);
  }

  getAllProducts(): Promise<Product[]> {
    return ProductRepository.find();
  }

  getProductById(id: string): Promise<Product> {
    return ProductRepository.findOne({ where: { id: id } });
  }
}
