import { Injectable } from '@nestjs/common';
import { DefaultResponseDto } from 'src/common/dtos/DefaultResponse.dto';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { CartEntity } from '../cart/entities/cart.entity';
import { CartStatus } from '../cart/enums/cart-status.enum';
import { CartService } from '../cart/services/cart.service';
import { UserService } from '../user/user.service';
import { CreateOrderDto } from './dtos/CreateOrder.dto';
import { OrderResponseDto } from './dtos/OrderResponse.dto';
import { OrderEntity } from './entities/order.entity';
import { OrderResponseMapper } from './mappers/order-response.mapper';
import { OrderService } from './order.service';

@Injectable()
export class OrderFacade {
  constructor(
    private readonly orderService: OrderService,
    private readonly cartService: CartService,
    private readonly userService: UserService,
  ) {}

  public async findAll(): Promise<OrderResponseDto[]> {
    const orderEntities = await this.orderService.findAll();
    return OrderResponseMapper.toResponseMany(orderEntities);
  }

  public async findOne(
    uuid: string,
    user: UserInterface,
  ): Promise<OrderResponseDto> {
    const orderEntity = await this.orderContext(uuid, user);
    return OrderResponseMapper.toResponseOne(orderEntity);
  }

  public async create(
    dto: CreateOrderDto,
    user: UserInterface,
  ): Promise<DefaultResponseDto> {
    const cartEntity = await this.cartContext(dto.cart, user);
    this.cartService.assertCartIsAvailable(cartEntity);
    this.cartService.assertCartHasItems(cartEntity);
    const orderEntity = await this.orderService.create(cartEntity);
    await this.cartService.changeCartStatus(cartEntity, CartStatus.CLOSED);
    return ResponseMapper.toResponse(
      DefaultResponseDto,
      orderEntity.id,
      'Order created successfully',
    );
  }

  public async pay(
    uuid: string,
    user: UserInterface,
  ): Promise<MessageResponseDto> {
    const orderEntity = await this.orderContext(uuid, user);
    await this.orderService.pay(orderEntity);
    const storedUser = await this.userService.findOne(orderEntity.cart.user.id);
    await this.cartService.create(storedUser);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Order marked as paid successfully',
    );
  }

  public async delete(
    uuid: string,
    user: UserInterface,
  ): Promise<MessageResponseDto> {
    const orderEntity = await this.orderContext(uuid, user);
    const cartEntity = await this.cartService.findOne(orderEntity.cart.id);
    await this.orderService.delete(orderEntity);
    await this.cartService.changeCartStatus(cartEntity, CartStatus.OPEN);
    return ResponseMapper.toResponse(
      MessageResponseDto,
      'Order deleted successfully',
    );
  }

  private async orderContext(
    uuid: string,
    user: UserInterface,
  ): Promise<OrderEntity> {
    const orderEntity = await this.orderService.findOne(uuid);
    checkUserPermission(user, orderEntity.cart.user.id);
    return orderEntity;
  }

  private async cartContext(
    uuid: string,
    user: UserInterface,
  ): Promise<CartEntity> {
    const cartEntity = await this.cartService.findOne(uuid);
    checkUserPermission(user, cartEntity.user.id);
    return cartEntity;
  }
}
