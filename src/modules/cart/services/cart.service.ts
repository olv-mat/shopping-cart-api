import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderStatus } from 'src/modules/order/enums/order-status.enum';
import { Repository } from 'typeorm';
import { UserEntity } from '../../user/entities/user.entity';
import { CartEntity } from '../entities/cart.entity';
import { CartStatus } from '../enums/cart-status.enum';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
  ) {}

  public findAll(): Promise<CartEntity[]> {
    return this.cartRepository.find();
  }

  public findOne(uuid: string): Promise<CartEntity> {
    return this.getCartById(uuid);
  }

  public create(userEntity: UserEntity): Promise<CartEntity> {
    return this.cartRepository.save({ user: userEntity });
  }

  public async getCurrentCart(
    userEntity: UserEntity,
  ): Promise<CartEntity | null> {
    let cartEntity: CartEntity | null;
    cartEntity = await this.cartRepository.findOneBy({
      user: { id: userEntity.id },
      status: CartStatus.OPEN,
    });
    if (cartEntity) return cartEntity;
    cartEntity = await this.cartRepository.findOne({
      where: {
        user: { id: userEntity.id },
        order: { status: OrderStatus.PENDING },
      },
    });
    return cartEntity;
  }

  public assertCartIsAvailable(cartEntity: CartEntity): void {
    if (cartEntity.status !== CartStatus.OPEN) {
      throw new BadRequestException('Cart is not available for modifications');
    }
  }

  public assertCartHasItems(cartEntity: CartEntity): void {
    if (cartEntity.items.length === 0) {
      throw new BadRequestException('Cart must contain at least one product');
    }
  }

  public async changeCartStatus(
    cartEntity: CartEntity,
    status: CartStatus,
  ): Promise<void> {
    await this.cartRepository.update(cartEntity.id, { status: status });
  }

  private async getCartById(uuid: string): Promise<CartEntity> {
    const cartEntity = await this.cartRepository.findOneBy({ id: uuid });
    if (!cartEntity) throw new NotFoundException('Cart not found');
    return cartEntity;
  }
}
