import { Injectable } from '@nestjs/common';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { CartResponseDto } from '../dtos/CartResponse.dto';
import { CartResponseMapper } from '../mappers/cart-response.mapper';
import { CartService } from '../services/cart.service';

@Injectable()
export class CartFacade {
  constructor(private readonly cartService: CartService) {}

  public async findAll(): Promise<CartResponseDto[]> {
    const cartEntities = await this.cartService.findAll();
    return CartResponseMapper.toResponseMany(cartEntities);
  }

  public async findOne(
    uuid: string,
    user: UserInterface,
  ): Promise<CartResponseDto> {
    const cartEntity = await this.cartService.findOne(uuid);
    checkUserPermission(user, cartEntity.user.id);
    return CartResponseMapper.toResponseOne(cartEntity);
  }
}
