import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from 'src/modules/product/entities/product.entity';
import { Repository } from 'typeorm';
import { CartItemEntity } from '../entities/cart-item.entity';
import { CartEntity } from '../entities/cart.entity';

@Injectable()
export class CartItemService {
  constructor(
    @InjectRepository(CartItemEntity)
    private readonly cartItemRepository: Repository<CartItemEntity>,
  ) {}

  public async increase(
    cart: CartEntity,
    product: ProductEntity,
    quantity: number,
  ): Promise<string> {
    const existingItem = this.findItem(cart.items, product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
      await this.cartItemRepository.save(existingItem);
      return 'Item quantity successfully increased';
    }
    await this.cartItemRepository.save({
      cart,
      product,
      quantity,
    });
    return 'Item successfully added to cart';
  }

  public async decrease(
    cart: CartEntity,
    product: ProductEntity,
    quantity: number,
  ): Promise<string> {
    const existingItem = this.findItem(cart.items, product.id);
    if (!existingItem) {
      throw new NotFoundException('Item not found in this cart');
    }

    const newQuantity = existingItem.quantity - quantity;
    if (newQuantity <= 0) {
      await this.cartItemRepository.delete(existingItem.id);
      return 'Item successfully removed from cart';
    }

    await this.cartItemRepository.save({
      ...existingItem,
      quantity: newQuantity,
    });
    return 'Item quantity successfully decreased';
  }

  private findItem(
    items: CartItemEntity[],
    uuid: string,
  ): CartItemEntity | undefined {
    return items.find((item) => item.product.id === uuid);
  }
}
