import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersDataService } from './orders-data.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersDataService]
})
export class OrdersModule {}
