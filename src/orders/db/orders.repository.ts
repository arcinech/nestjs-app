import { dataSource } from '../../data-source';
import { Orders } from './orders.entity';

export const OrdersRepository = dataSource.getRepository(Orders).extend({});
