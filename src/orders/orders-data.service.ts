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
import { UpdateOrderDto, UpdateOrderItemDto } from './dto/update-order.dto';
import { OrdersRepository } from './db/orders.repository';
import { OrderItemRepository } from './db/order-item.repository';

@Injectable()
export class OrdersDataService {
  async prepareOrderItemsToSave(
    orderItems: CreateOrderItemDto[] | UpdateOrderItemDto[],
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
  async addOrder(newOrder: CreateOrderDto): Promise<Orders> {
    return dataSource.transaction(async (manager: EntityManager) => {
      const orderToSave = new Orders();

      orderToSave.status = Status.NEW;
      orderToSave.additionalInfo = '' ?? newOrder?.additionalInfo;
      orderToSave.user = new User();
      orderToSave.user.id = newOrder.userId;
      orderToSave.address = new UserAddress();
      orderToSave.address.id = newOrder.addressId;
      orderToSave.orderItems = await this.prepareOrderItemsToSave(
        newOrder.orderItems,
        manager,
      );

      orderToSave.total = orderToSave.orderItems?.reduce(
        (prevValue, currentItem) => prevValue + currentItem.price,
        0,
      );

      return await manager.getRepository(Orders).save(orderToSave);
    });
  }

  async updateOrderById(
    id: string,
    updatedOrder: UpdateOrderDto,
  ): Promise<Orders> {
    return dataSource.transaction(async (manager) => {
      const orderManager = manager.withRepository(OrdersRepository);
      await manager
        .withRepository(OrderItemRepository)
        .deleteProductOrderByOrderId(id);
      const orderToUpdate = await orderManager.findOne({ where: { id: id } });

      orderToUpdate.status = updatedOrder.status;
      orderToUpdate.additionalInfo = updatedOrder.additionalInfo;
      orderToUpdate.user = new User();
      orderToUpdate.user.id = updatedOrder.userId;
      orderToUpdate.address = new UserAddress();
      orderToUpdate.address.id = updatedOrder.addressId;
      orderToUpdate.orderItems = await this.prepareOrderItemsToSave(
        updatedOrder.orderItems,
        manager,
      );

      orderToUpdate.total = orderToUpdate.orderItems?.reduce(
        (prev, curr) => prev + curr.price,
        0,
      );

      return manager.withRepository(OrdersRepository).save(orderToUpdate);
    });
  }

  getAllOrders(): Promise<Orders[]> {
    return OrdersRepository.find();
  }

  getOrderById(id: string): Promise<Orders> {
    return OrdersRepository.findOne({ where: { id: id } });
  }

  async deleteOrderById(id: string): Promise<void> {
    OrdersRepository.delete(id);
  }
}
