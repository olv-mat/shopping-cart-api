import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { Repository } from 'typeorm';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartStatus } from '../cart/enums/cart-status.enum';
import { CartService } from '../cart/services/cart.service';
import { UserService } from '../user/user.service';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderStatus } from './enums/order-status.enum';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly responseMapper: ResponseMapper,
  ) {}

  public async findAll(): Promise<OrderEntity[]> {
    return this.orderRepository.find();
  }

  public async findOne(
    user: UserInterface,
    uuid: string,
  ): Promise<OrderEntity> {
    const order = await this.findOrderById(uuid);
    const orderOwner = this.getOrderOwner(order);
    checkUserPermission(user, orderOwner);
    return order;
  }

  public async create(
    user: UserInterface,
    dto: CreateOrderDto,
  ): Promise<DefaultResponseDto> {
    const cart = await this.cartService.findCartById(dto.cart);
    const cartOwner = this.getCartOwner(cart);
    checkUserPermission(user, cartOwner);

    if (cart.status !== CartStatus.OPEN) {
      throw new BadRequestException('Cart not available for order');
    }

    if (cart.items.length === 0) {
      throw new BadRequestException('Cart must contain at least one product');
    }

    const total_price = cart.items
      .reduce((acc, item) => {
        const price = Number(item.product.price);
        return acc + price * item.quantity;
      }, 0)
      .toFixed(2);

    const order = await this.orderRepository.save({
      cart: cart,
      totalPrice: total_price,
    });

    await this.cartService.changeCartStatus(cart, CartStatus.CLOSED);

    return this.responseMapper.toDefaultResponse(
      order.id,
      'Order created successfully',
    );
  }

  public async pay(
    user: UserInterface,
    uuid: string,
  ): Promise<DefaultResponseDto> {
    const order = await this.findOrderById(uuid);
    const orderOwner = this.getOrderOwner(order);
    checkUserPermission(user, orderOwner);

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException(
        'Order cannot be updated with current status',
      );
    }

    const storedUser = await this.userService.findUserById(order.cart.user.id);
    await this.orderRepository.update(order.id, { status: OrderStatus.PAID });
    await this.cartService.createCart(storedUser);

    return this.responseMapper.toDefaultResponse(
      order.id,
      'Order marked as paid successfully',
    );
  }

  public async delete(
    user: UserInterface,
    uuid: string,
  ): Promise<DefaultResponseDto> {
    const order = await this.findOrderById(uuid);
    const orderOwner = this.getOrderOwner(order);
    checkUserPermission(user, orderOwner);
    const cart = await this.cartService.findCartById(order.cart.id);

    await this.orderRepository.delete(order.id);
    await this.cartService.changeCartStatus(cart, CartStatus.OPEN);

    return this.responseMapper.toDefaultResponse(
      order.id,
      'Order deleted successfully',
    );
  }

  private async findOrderById(uuid: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: { id: uuid },
      relations: ['cart', 'cart.user'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  private getOrderOwner(order: OrderEntity): string {
    return order.cart.user.id;
  }

  private getCartOwner(cart: CartEntity): string {
    return cart.user.id;
  }
}
