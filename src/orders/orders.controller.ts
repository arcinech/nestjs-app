import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { OrdersDataService } from './orders-data.service';
import { OrderItem } from './db/order-item.entity';
import { Orders } from './db/orders.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import {
  ExternalOrderDto,
  ExternalOrderItemDto,
} from './dto/external-order.dto';
import { dateToArray } from '../shared/helpers/date.helper';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private orderRepostory: OrdersDataService) {}
  mapOrderToExternal(order: Orders): ExternalOrderDto {
    return {
      ...order,
      createdAt: dateToArray(order.createdAt),
      updatedAt: dateToArray(order.updatedAt),
      userFirstName: order.user.firstName,
      userLastName: order.user.lastName,
      userEmail: order.user.email,
      userAddress: order.address,
      orderItems: order.orderItems.map((item) =>
        this.mapOrderItemToExternal(item),
      ),
    };
  }

  mapOrderItemToExternal(orderItem: OrderItem): ExternalOrderItemDto {
    return {
      ...orderItem,
      productId: orderItem.product.id,
      productName: orderItem.product.name,
    };
  }

  @Post()
  async addOrder(@Body() _order_: CreateOrderDto): Promise<ExternalOrderDto> {
    return this.mapOrderToExternal(await this.orderRepostory.addOrder(_order_));
  }

  @Put(':id')
  async updateOrder(
    @Param('id') _id_: string,
    @Body() _order_: UpdateOrderDto,
  ): Promise<ExternalOrderDto> {
    return this.mapOrderToExternal(
      await this.orderRepostory.updateOrderById(_id_, _order_),
    );
  }

  @Get()
  async getAllOrders(): Promise<Array<ExternalOrderDto>> {
    const orders = await this.orderRepostory.getAllOrders();
    return orders.map((order) => this.mapOrderToExternal(order));
  }

  @Get(':id')
  async getProductById(@Param('id') _id_: string): Promise<ExternalOrderDto> {
    return this.mapOrderToExternal(
      await this.orderRepostory.getOrderById(_id_),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteOrder(@Param('id') _id_: string): Promise<void> {
    await this.orderRepostory.deleteOrderById(_id_);
  }
}
