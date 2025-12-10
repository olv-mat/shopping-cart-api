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
    cartEntity: CartEntity,
    productEntity: ProductEntity,
    quantity: number,
  ): Promise<string> {
    const cartItemEntity = this.findItem(cartEntity.items, productEntity.id);
    if (cartItemEntity) {
      cartItemEntity.quantity += quantity;
      await this.cartItemRepository.save(cartItemEntity);
      return 'Item quantity successfully increased';
    }
    await this.cartItemRepository.save({
      cartEntity,
      productEntity,
      quantity,
    });
    return 'Item successfully added to cart';
  }

  public async decrease(
    cartEntity: CartEntity,
    productEntity: ProductEntity,
    quantity: number,
  ): Promise<string> {
    const cartItemEntity = this.findItem(cartEntity.items, productEntity.id);
    if (!cartItemEntity) {
      throw new NotFoundException('Item not found in this cart');
    }

    const newQuantity = cartItemEntity.quantity - quantity;
    if (newQuantity <= 0) {
      await this.cartItemRepository.delete(cartItemEntity.id);
      return 'Item successfully removed from cart';
    }

    await this.cartItemRepository.save({
      ...cartItemEntity,
      quantity: newQuantity,
    });
    return 'Item quantity successfully decreased';
  }

  private findItem(
    cartItemEntities: CartItemEntity[],
    uuid: string,
  ): CartItemEntity | undefined {
    return cartItemEntities.find(
      (cartItemEntity) => cartItemEntity.product.id === uuid,
    );
  }
}
