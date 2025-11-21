import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  public async findAll(): Promise<CartEntity[]> {
    return await this.cartRepository.find();
  }

  public async findOne(uuid: string): Promise<CartEntity> {
    return await this.getCartById(uuid);
  }

  public async create(user: UserEntity): Promise<CartEntity> {
    return await this.cartRepository.save({ user: user });
  }

  public assertCartIsAvailable(cart: CartEntity): void {
    if (cart.status !== CartStatus.OPEN) {
      throw new BadRequestException('Cart is not available for modifications');
    }
  }

  public assertCartHasItems(cart: CartEntity): void {
    if (cart.items.length === 0) {
      throw new BadRequestException('Cart must contain at least one product');
    }
  }

  public async changeCartStatus(
    cart: CartEntity,
    status: CartStatus,
  ): Promise<void> {
    await this.cartRepository.update(cart.id, { status: status });
  }

  private async getCartById(uuid: string): Promise<CartEntity> {
    const cart = await this.cartRepository.findOneBy({ id: uuid });
    if (!cart) throw new NotFoundException('Cart not found');
    return cart;
  }
}
