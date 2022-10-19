import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  HttpCode,
  Param,
  Put,
  Patch,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersDataService } from './orders-data.service';
import { OrderItem } from './db/order-item.entity';
import { Orders } from './db/orders.entity';
import { CreateOrderDto, CreateOrderItemDto } from './dto/create-order.dto';
import {
  ExternalOrderDto,
  ExternalOrderItemDto,
} from './dto/external-order.dto';
import { dateToArray } from '../shared/helpers/date.helper';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private orderDataService: OrdersDataService) {}
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
        this.mapToExternalOrderItem(item),
      ),
    };
  }

  mapToExternalOrderItem(orderItem: OrderItem): ExternalOrderItemDto {
    return {
      ...orderItem,
      productId: orderItem.product.id,
      productName: orderItem.product.name,
    };
  }

  @Post()
  async addOrder(@Body() _order_: CreateOrderDto): Promise<ExternalOrderDto> {
    return this.mapOrderToExternal(
      await this.orderDataService.addOrder(_order_),
    );
  }

  @Put(':id')
  async updateOrder(
    @Param('id') _id_: string,
    @Body() _order_: UpdateOrderDto,
  ): Promise<ExternalOrderDto> {
    return this.mapOrderToExternal(
      await this.orderDataService.updateOrderById(_id_, _order_),
    );
  }

  @Get()
  async getAllOrders(): Promise<Array<ExternalOrderDto>> {
    const orders = await this.orderDataService.getAllOrders();
    return orders.map((order) => this.mapOrderToExternal(order));
  }

  @Get(':id')
  async getProductById(@Param('id') _id_: string): Promise<ExternalOrderDto> {
    return this.mapOrderToExternal(
      await this.orderDataService.getOrderById(_id_),
    );
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteOrder(@Param('id') _id_: string): Promise<void> {
    await this.orderDataService.deleteOrderById(_id_);
  }

  @Delete(':orderId/products/:idOrderItem')
  @HttpCode(204)
  async deleteProductFromOrder(
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('idOrderItem', new ParseUUIDPipe({ version: '4' }))
    idOrderItem: string,
  ): Promise<ExternalOrderDto> {
    return this.mapOrderToExternal(
      await this.orderDataService.removeOrderItem(orderId, idOrderItem),
    );
  }

  @Patch(':id/products')
  async addProductToOrder(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() createOrderProductsDto: CreateOrderItemDto,
  ): Promise<ExternalOrderItemDto> {
    return this.mapToExternalOrderItem(
      await this.orderDataService.addOrderItem(id, createOrderProductsDto),
    );
  }

  @Patch(':orderId/:userAddressId')
  async updateUserAddress(
    @Param('orderId', new ParseUUIDPipe({ version: '4' })) orderId: string,
    @Param('userAddressId', new ParseUUIDPipe({ version: '4' }))
    userAddressId: string,
  ): Promise<ExternalOrderDto> {
    return this.mapOrderToExternal(
      await this.orderDataService.updateUserAddress(orderId, userAddressId),
    );
  }
}
