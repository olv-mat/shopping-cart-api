import { Injectable } from '@nestjs/common';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { ProductService } from '../../product/product.service';
import { UpdateCartItemDto } from '../dtos/UpdateCartItem.dto';
import { CartItemService } from '../services/cart-item.service';
import { CartService } from '../services/cart.service';

@Injectable()
export class CartItemFacade {
  constructor(
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly cartItemService: CartItemService,
  ) {}

  public async increase(
    uuid: string,
    user: UserInterface,
    dto: UpdateCartItemDto,
  ) {
    const { cart, product, quantity } = await this.context(uuid, user, dto);
    const message = await this.cartItemService.increase(
      cart,
      product,
      quantity,
    );
    return ResponseMapper.toResponse(MessageResponseDto, message);
  }

  public async decrease(
    uuid: string,
    user: UserInterface,
    dto: UpdateCartItemDto,
  ) {
    const { cart, product, quantity } = await this.context(uuid, user, dto);
    const message = await this.cartItemService.decrease(
      cart,
      product,
      quantity,
    );
    return ResponseMapper.toResponse(MessageResponseDto, message);
  }

  private async context(
    uuid: string,
    user: UserInterface,
    dto: UpdateCartItemDto,
  ) {
    const cart = await this.cartService.findCartById(uuid);
    checkUserPermission(user, cart.user.id);
    this.cartService.checkIfAvailable(cart.status);
    const product = await this.productService.findProductById(dto.product);
    const quantity = dto.quantity;
    return { cart, product, quantity };
  }
}
