import { Injectable } from '@nestjs/common';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { CartService } from '../services/cart.service';

@Injectable()
export class CartFacade {
  constructor(private readonly cartService: CartService) {}

  public async findOne(uuid: string, user: UserInterface) {
    const cart = await this.cartService.findOne(uuid);
    checkUserPermission(user, cart.user.id);
    return cart;
  }
}
