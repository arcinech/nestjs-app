import { Product } from '../../products/db/products.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { Orders } from './orders.entity';

@Entity({
  name: 'order_items',
})
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ type: 'float' })
  total: number;

  @ManyToOne(() => Orders, (order) => order.id, {
    onDelete: 'CASCADE',
  })
  order: Orders;

  @ManyToOne(() => Product, (product) => product.id)
  productId: Product;

  @ManyToOne(() => Product, (product) => product.name)
  productName: Product;

  @Column({ type: 'float' })
  @ManyToOne(() => Product, (product) => product.price)
  productPrice: Product;
}
