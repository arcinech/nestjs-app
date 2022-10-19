import { dataSource } from '../../data-source';
import { Orders } from './orders.entity';

export const OrdersRepository = dataSource.getRepository(Orders).extend({
  async updateUserAddress(
    orderId: string,
    newAddressId: string,
  ): Promise<Orders> {
    await this.orderRepository.update(
      {
        id: orderId,
      },
      {
        userAddress: {
          id: newAddressId,
        },
      },
    );

    return this.orderRepository.findOne(orderId);
  },
});
