import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { OrderEntity } from './entities/order.entity';
import { OrderController } from './order.controller';
import { OrderFacade } from './order.facade';
import { OrderService } from './order.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity]), CartModule, UserModule],
  controllers: [OrderController],
  providers: [OrderService, OrderFacade],
})
export class OrderModule {}
