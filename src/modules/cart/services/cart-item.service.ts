import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageResponseDto } from 'src/common/dtos/MessageResponse.dto';
import { ResponseMapper } from 'src/common/mappers/response.mapper';
import { ProductService } from 'src/modules/product/product.service';
import { Repository } from 'typeorm';
import { UpdateCartItemDto } from '../dtos/UpdateCartItem.dto';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CartStatus } from '../enums/cart-status.enum';
import { CartService } from './cart.service';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { checkUserPermission } from 'src/common/utils/check-user-permission.util';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
    private readonly cartService: CartService,
    private readonly productService: ProductService,
    private readonly responseMapper: ResponseMapper,
  ) {}

  public async increase(
    user: UserInterface,
    uuid: string,
    dto: UpdateCartItemDto,
  ): Promise<MessageResponseDto> {
    const cart = await this.cartService.findCartById(uuid);
    checkUserPermission(user, cart.user.id);
    this.checkIfAvailable(cart.status);
    const product = await this.productService.findProductById(dto.product);
    const quantity = dto.quantity;

    const existingItem = this.findItem(cart.items, product.id);
    const [item, message] = existingItem
      ? [
          { ...existingItem, quantity: existingItem.quantity + quantity },
          'Item quantity successfully increased',
        ]
      : [{ cart, product, quantity }, 'Item successfully added to cart'];

    await this.cartItemRepository.save(item);
    return this.responseMapper.toMessageResponse(message);
  }

  public async decrease(
    user: UserInterface,
    uuid: string,
    dto: UpdateCartItemDto,
  ): Promise<MessageResponseDto> {
    const cart = await this.cartService.findCartById(uuid);
    checkUserPermission(user, cart.user.id);
    this.checkIfAvailable(cart.status);
    const product = await this.productService.findProductById(dto.product);
    const quantity = dto.quantity;

    const existingItem = this.findItem(cart.items, product.id);
    if (!existingItem) {
      throw new NotFoundException('Item not found in this cart');
    }

    const newQuantity = existingItem.quantity - quantity;
    if (newQuantity <= 0) {
      await this.cartItemRepository.delete(existingItem.id);
      return this.responseMapper.toMessageResponse(
        'Item successfully removed from cart',
      );
    }

    await this.cartItemRepository.save({
      ...existingItem,
      quantity: newQuantity,
    });
    return this.responseMapper.toMessageResponse(
      'Item quantity successfully decreased',
    );
  }

  private checkIfAvailable(status: CartStatus): void {
    if (status !== CartStatus.OPEN) {
      throw new BadRequestException('Cart is not available for modifications');
    }
  }

  private findItem(
    items: CartItemEntity[],
    uuid: string,
  ): CartItemEntity | undefined {
    return items.find((item) => item.product.id === uuid);
  }
}
