import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CartEntity } from '../cart/entities/cart.entity';
import { OrderEntity } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
  ) {}

  public findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }

  public findOne(uuid: string): Promise<OrderEntity> {
    return this.getOrderById(uuid);
  }

  public create(cartEntity: CartEntity): Promise<OrderEntity> {
    const total_price = cartEntity.items
      .reduce((acc, item) => {
        const price = Number(item.product.price);
        return acc + price * item.quantity;
      }, 0)
      .toFixed(2);

    return this.orderRepository.save({
      cart: cartEntity,
      totalPrice: total_price,
    });
  }

  public async pay(orderEntity: OrderEntity): Promise<void> {
    if (orderEntity.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        'Order cannot be updated with current status',
      );
    }
    await this.orderRepository.update(orderEntity.id, {
      status: OrderStatus.PAID,
    });
  }

  public async delete(orderEntity: OrderEntity): Promise<void> {
    await this.orderRepository.delete(orderEntity.id);
  }

  private async getOrderById(uuid: string): Promise<OrderEntity> {
    const orderEntity = await this.orderRepository.findOne({
      where: { id: uuid },
      relations: ['cart', 'cart.user'],
    });
    if (!orderEntity) throw new NotFoundException('Order not found');
    return orderEntity;
  }
}
