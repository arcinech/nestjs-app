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
  price: number;

  @ManyToOne(() => Orders, (order) => order.id, {
    onDelete: 'CASCADE',
  })
  order: Orders;

  @ManyToOne(() => Product, (product) => product.id, { eager: true })
  product: Product;
}
