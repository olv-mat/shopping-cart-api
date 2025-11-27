import { Injectable } from '@nestjs/common';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartStatus } from '../cart/enums/cart-status.enum';
import { CartService } from '../cart/services/cart.service';
import { UserService } from '../user/user.service';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderService } from './order.service';

@Injectable()
export class OrderFacade {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
  ) {}

  public async findOne(
    uuid: string,
    user: UserInterface,
  ): Promise<OrderEntity> {
    return await this.orderContext(uuid, user);
  }

  public async create(
    dto: CreateOrderDto,
    user: UserInterface,
  ): Promise<DefaultResponseDto> {
    const cart = await this.cartContext(dto.cart, user);
    this.cartService.assertCartIsAvailable(cart);
    this.cartService.assertCartHasItems(cart);
    const order = await this.orderService.create(cart);
    await this.cartService.changeCartStatus(cart, CartStatus.CLOSED);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      order.id,
      'Order created successfully',
    );
  }

  public async pay(
    uuid: string,
    user: UserInterface,
  ): Promise<DefaultResponseDto> {
    const order = await this.orderContext(uuid, user);
    await this.orderService.pay(order);
    const storedUser = await this.userService.findOne(order.cart.user.id);
    await this.cartService.create(storedUser);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      order.id,
      'Order marked as paid successfully',
    );
  }

  public async delete(
    uuid: string,
    user: UserInterface,
  ): Promise<DefaultResponseDto> {
    const order = await this.orderContext(uuid, user);
    const cart = await this.cartService.findOne(order.cart.id);
    await this.orderService.delete(order);
    await this.cartService.changeCartStatus(cart, CartStatus.OPEN);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      order.id,
      'Order deleted successfully',
    );
  }

  private async orderContext(
    uuid: string,
    user: UserInterface,
  ): Promise<OrderEntity> {
    const order = await this.orderService.findOne(uuid);
    checkUserPermission(user, order.cart.user.id);
    return order;
  }

  private async cartContext(
    uuid: string,
    user: UserInterface,
  ): Promise<CartEntity> {
    const cart = await this.cartService.findOne(uuid);
    checkUserPermission(user, cart.user.id);
    return cart;
  }
}
