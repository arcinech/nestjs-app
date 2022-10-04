import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { User } from '../../users/db/user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  listenTo(): any {
    return User;
  }

  beforeInsert(event: InsertEvent<User>): void {
    console.log(`BEFORE INSERT NEW USER: `, event.entity);
    return null;
  }

  afterInsert(event: InsertEvent<User>): void {
    console.log(`AFTER INSERT NEW USER: `, event.entity);
  }

  beforeUpdate(event: UpdateEvent<User>): void {
    console.log(`BEFORE UPDATE USER: `, event.entity);
  }

  afterUpdate(event: UpdateEvent<User>): void {
    console.log(`AFTER UPDATE USER: `, event.entity);
  }

  beforeRemove(event: RemoveEvent<User>): void {
    console.log(`BEFORE REMOVE USER: `, event.entity);
  }

  afterRemove(): void {
    console.log(`AFTER REMOVE USER: `);
  }

  afterLoad(): void {
    console.log('AFTER LOAD USERS');
  }
}
