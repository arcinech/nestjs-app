import { Injectable } from '@nestjs/common';
import { Product } from 'src/products/db/products.entity';
import { User } from 'src/users/db/user.entity';
import { UserAddress } from 'src/users/db/userAddress.entity';
import { EntityManager } from 'typeorm';
import { dataSource } from '../data-source';
import { OrderItem } from './db/order-item.entity';
import { Orders } from './db/orders.entity';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { Status } from './enums/status.enums';

@Injectable()
export class OrdersDataService {
  async addOrder(newOrder: CreateOrderDto): Promise<Orders> {
    return dataSource.transaction(async (manager: EntityManager) => {
      const orderToSave = new Orders();

      orderToSave.status = Status.NEW;
      orderToSave.additionalInfo = newOrder.additionalInfo;
      orderToSave.user = new User();
      orderToSave.user.id = newOrder.userId;
      orderToSave.address = new UserAddress();
      orderToSave.address.id = newOrder.addressId;
      orderToSave.orderItems = await this.prepareOrderItemsToSave(
        newOrder.orderItems,
        manager,
      );

      orderToSave.total =
        0 ??
        orderToSave.orderItems?.reduce(
          (prevValue, currentItem) => prevValue + currentItem.price,
          0,
        );

      return await manager.getRepository(Orders).save(orderToSave);
    });
  }

  async prepareOrderItemsToSave(
    orderItems: CreateOrderItemDto[],
    manager,
  ): Promise<OrderItem[]> {
    const itemsListToSave: OrderItem[] = [];

    for (const add of orderItems) {
      const orderItemToSave = new OrderItem();

      orderItemToSave.product = new Product();
      orderItemToSave.product.id = add.productId;

      orderItemToSave.quantity = add.quantity;
      orderItemToSave.price = await manager
        .getRepository(Product)
        .findOne({ id: add.productId })
        .then((product) => product.price);
      itemsListToSave.push(
        await manager.getRepository(OrderItem).save(orderItemToSave),
      );
    }

    return itemsListToSave;
  }
}
