import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersDataService } from './orders-data.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './db/orders.entity';
import { OrderItem } from './db/order-item.entity';

@Module({
  controllers: [OrdersController],
  providers: [OrdersDataService, Orders, OrderItem],
  imports: [TypeOrmModule.forFeature([Orders, OrderItem])],
})
export class OrdersModule {}
