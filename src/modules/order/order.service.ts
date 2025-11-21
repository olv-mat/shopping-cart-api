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

  public async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }

  public async findOne(uuid: string): Promise<OrderEntity> {
    return await this.findOrderById(uuid);
  }

  public async create(cart: CartEntity): Promise<OrderEntity> {
    const total_price = cart.items
      .reduce((acc, item) => {
        const price = Number(item.product.price);
        return acc + price * item.quantity;
      }, 0)
      .toFixed(2);

    return await this.orderRepository.save({
      cart: cart,
      totalPrice: total_price,
    });
  }

  public async pay(order: OrderEntity): Promise<void> {
    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        'Order cannot be updated with current status',
      );
    }
    await this.orderRepository.update(order.id, {
      status: OrderStatus.PAID,
    });
  }

  public async delete(order: OrderEntity): Promise<void> {
    await this.orderRepository.delete(order.id);
  }

  private async findOrderById(uuid: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: uuid },
      relations: ['cart', 'cart.user'],
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
