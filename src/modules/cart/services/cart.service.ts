import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  public async findOne(user: UserInterface, uuid: string): Promise<CartEntity> {
    const cart = await this.findCartById(uuid);
    checkUserPermission(user, cart.user.id);
    return cart;
  }

  public async createCart(user: UserEntity): Promise<CartEntity> {
    return await this.cartRepository.save({
      user: user,
    });
  }

  public async changeCartStatus(
    cart: CartEntity,
    status: CartStatus,
  ): Promise<void> {
    await this.cartRepository.update(cart.id, { status: status });
  }

  public async findCartById(uuid: string): Promise<CartEntity> {
    return this.findOneOrThrow({ id: uuid });
  }

  public async findActiveCartByUser(user: UserEntity) {
    return this.findOneOrThrow({
      user: { id: user.id },
      status: CartStatus.OPEN,
    });
  }

  private async findOneOrThrow(
    where: FindOptionsWhere<CartEntity>,
  ): Promise<CartEntity> {
    const cart = await this.cartRepository.findOne({ where });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }
    return cart;
  }
}
