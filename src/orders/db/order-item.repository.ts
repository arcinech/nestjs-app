import { dataSource } from '../../data-source';
import { OrderItem } from './order-item.entity';

export const OrderItemRepository = dataSource.getRepository(OrderItem).extend({
  async deleteProductOrderByOrderId(orderId: string): Promise<void> {
    const orderProducts = await this.find({
      where: {
        order: orderId,
      },
    });

    await this.remove(orderProducts);
  },
});
