import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { Orders } from '../../orders/db/orders.entity';

@EventSubscriber()
export class OrderSubscriber implements EntitySubscriberInterface<Orders> {
  listenTo(): any {
    return Orders;
  }

  beforeInsert(event: InsertEvent<Orders>): void {
    console.log(`BEFORE INSERT NEW ORDER: `, event.entity);
    return null;
  }

  afterInsert(event: InsertEvent<Orders>): void {
    console.log(`AFTER INSERT NEW ORDER: `, event.entity);
  }

  beforeUpdate(event: UpdateEvent<Orders>): void {
    console.log(`BEFORE UPDATE ORDER: `, event.entity);
  }

  afterUpdate(event: UpdateEvent<Orders>): void {
    console.log(`AFTER UPDATE ORDER: `, event.entity);
  }

  beforeRemove(event: RemoveEvent<Orders>): void {
    console.log(`BEFORE REMOVE ORDER: `, event.entity);
  }

  afterRemove(): void {
    console.log(`AFTER REMOVE ORDER: `);
  }

  afterLoad(): void {
    console.log('AFTER LOAD ORDERS');
  }
}
