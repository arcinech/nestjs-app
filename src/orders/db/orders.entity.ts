import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { OrderItem } from './order-item.entity';
import { Status } from '../enums/status.enums';
import { User } from '../../users/db/user.entity';
import { UserAddress } from '../../users/db/userAddress.entity';

@Entity({
  name: 'orders',
})
export class Orders {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems?: OrderItem[];

  @Column('enum', {
    enum: Status,
  })
  status: Status;

  @ManyToOne(() => User, (user) => user.id, {
    onDelete: 'CASCADE',
  })
  userId: User;

  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @ManyToOne(() => UserAddress, (userAddres) => userAddres.id)
  addressId: UserAddress;
}
