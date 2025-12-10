import { Injectable } from '@nestjs/common';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { ProductService } from '../../product/product.service';
import { UpdateCartItemDto } from '../dtos/UpdateCartItem.dto';
import { CartEntity } from '../entities/cart.entity';
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
  ): Promise<MessageResponseDto> {
    const { cartEntity, productEntity, quantity } = await this.context(
      uuid,
      user,
      dto,
    );
    const message = await this.cartItemService.increase(
      cartEntity,
      productEntity,
      quantity,
    );
    return ResponseMapper.toResponse(MessageResponseDto, message);
  }

  public async decrease(
    uuid: string,
    user: UserInterface,
    dto: UpdateCartItemDto,
  ): Promise<MessageResponseDto> {
    const { cartEntity, productEntity, quantity } = await this.context(
      uuid,
      user,
      dto,
    );
    const message = await this.cartItemService.decrease(
      cartEntity,
      productEntity,
      quantity,
    );
    return ResponseMapper.toResponse(MessageResponseDto, message);
  }

  private async context(
    uuid: string,
    user: UserInterface,
    dto: UpdateCartItemDto,
  ): Promise<{
    cartEntity: CartEntity;
    productEntity: ProductEntity;
    quantity: number;
  }> {
    const cartEntity = await this.cartService.findOne(uuid);
    checkUserPermission(user, cartEntity.user.id);
    this.cartService.assertCartIsAvailable(cartEntity);
    const productEntity = await this.productService.findOne(dto.product);
    const quantity = dto.quantity;
    return { cartEntity, productEntity, quantity };
  }
}
