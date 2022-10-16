import { Injectable } from '@nestjs/common';
import { Product } from 'src/products/db/products.entity';
import { User } from 'src/users/db/user.entity';
import { UserAddress } from 'src/users/db/userAddress.entity';
import { EntityManager, In } from 'typeorm';
import { dataSource } from '../data-source';
import { OrderItem } from './db/order-item.entity';
import { Orders } from './db/orders.entity';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import { Status } from './enums/status.enums';
import { UpdateOrderDto, UpdateOrderItemDto } from './dto/update-order.dto';
import { OrdersRepository } from './db/orders.repository';
import { OrderItemRepository } from './db/order-item.repository';
import { ProductRepository } from 'src/products/db/products.repository';
import { UserAddressRepository } from 'src/users/db/userAddress.repository';

@Injectable()
export class OrdersDataService {
  async prepareOrderItemsToSave(
    orderItems: CreateOrderItemDto[] | UpdateOrderItemDto[],
    manager,
  ): Promise<OrderItem[]> {
    const itemsListToSave: OrderItem[] = [];

    const products: Product[] = await manager
      .withRepository(ProductRepository)
      .findBy({ id: In(orderItems?.map((item) => item.productId)) });

    if (orderItems.length > 0 && products.length === 0) {
      throw new Error(orderItems?.map((item) => item.productId).join(' '));
    }

    for (const add of products) {
      const orderItemToSave = new OrderItem();
      orderItemToSave.product = new Product();
      orderItemToSave.product.id = add?.id;

      orderItemToSave.price = add?.price;

      orderItemToSave.quantity = orderItems?.find(
        (item) => item.productId === add.id,
      )?.quantity;

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
        (prevValue, currentItem) =>
          prevValue + currentItem.price * currentItem.quantity,
        0,
      );

      return await manager.getRepository(Orders).save(orderToSave);
    });
  }

  async addOrderItem(orderId: string, orderItem: CreateOrderItemDto) {
    return dataSource.transaction(async (manager) => {
      const product = await manager
        .withRepository(ProductRepository)
        .findOneBy({ id: orderItem.productId });

      if (!product) {
        throw new Error('Product does not exists');
      }

      return manager
        .withRepository(OrderItemRepository)
        .addProductToOrder(orderId, orderItem, product);
    });
  }

  async removeOrderItem(orderId: string, orderItemId: string): Promise<Orders> {
    return dataSource.transaction(async (manager) => {
      const order = await manager
        .withRepository(OrdersRepository)
        .findOneBy({ id: orderId });
      const orderItem = await manager
        .getRepository(OrderItem)
        .findOne({ where: { id: orderItemId } });

      if (
        !orderItem ||
        !order ||
        order.orderItems?.find((item) => item.id === orderItem.id)
      ) {
        throw new Error(
          'This order item or order does not exists or item does not exists on order',
        );
      }

      await manager.withRepository(OrderItemRepository).delete(orderItemId);

      return await manager
        .withRepository(OrdersRepository)
        .findOneBy({ id: orderId });
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
        .deleteOrderItemsByOrderId(id);

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
        (prev, curr) => prev + curr.price * curr.quantity,
        0,
      );

      return orderManager.save(orderToUpdate);
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

  async updateUserAddress(
    orderId: string,
    newAddressId: string,
  ): Promise<Orders> {
    return dataSource.transaction(async (manager) => {
      const address = await manager
        .withRepository(UserAddressRepository)
        .findOneBy({ id: newAddressId });

      if (!address) {
        throw new Error(`Address does not exists`);
      }

      return manager
        .withRepository(OrdersRepository)
        .updateUserAddress(orderId, newAddressId);
    });
  }
}
