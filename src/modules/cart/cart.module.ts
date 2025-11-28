import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductModule } from '../product/product.module';
import { CartItemController } from './controllers/cart-item.controller';
import { CartController } from './controllers/cart.controller';
import { CartItemEntity } from './entities/cart-item.entity';
import { CartEntity } from './entities/cart.entity';
import { CartItemFacade } from './facades/cart-item.facade';
import { CartFacade } from './facades/cart.facade';
import { CartItemService } from './services/cart-item.service';
import { CartService } from './services/cart.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CartEntity, CartItemEntity]),
    ProductModule,
  ],
  controllers: [CartController, CartItemController],
  providers: [CartItemFacade, CartFacade, CartItemService, CartService],
  exports: [CartService],
})
export class CartModule {}
