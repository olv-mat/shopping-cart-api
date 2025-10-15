import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CartStatus } from '../enums/cart-status.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { CartItemEntity } from './cart-item.entity';
import { OrderEntity } from 'src/modules/order/entities/order.entity';

@Entity({ name: 'carts' })
export class CartEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.carts, {
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ type: 'enum', enum: CartStatus, default: CartStatus.OPEN })
  status: CartStatus;

  @OneToMany(() => CartItemEntity, (item) => item.cart, {
    eager: true,
  })
  items: CartItemEntity[];

  @OneToOne(() => OrderEntity, (order) => order.cart, {
    eager: true,
  })
  order: OrderEntity;
}
