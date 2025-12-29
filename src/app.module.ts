import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { CartItemEntity } from './modules/cart/entities/cart-item.entity';
import { CartEntity } from './modules/cart/entities/cart.entity';
import { CategoryModule } from './modules/category/category.module';
import { CategoryEntity } from './modules/category/entities/category.entity';
import { MonitoringModule } from './modules/monitoring/monitoring.module';
import { OrderEntity } from './modules/order/entities/order.entity';
import { OrderModule } from './modules/order/order.module';
import { ProductEntity } from './modules/product/entities/product.entity';
import { ProductModule } from './modules/product/product.module';
import { UserEntity } from './modules/user/entities/user.entity';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DATABASE_HOST'),
        port: configService.getOrThrow('DATABASE_PORT'),
        username: configService.getOrThrow('DATABASE_USERNAME'),
        password: configService.getOrThrow('DATABASE_PASSWORD'),
        database: configService.getOrThrow('DATABASE_NAME'),
        entities: [
          CartItemEntity,
          CartEntity,
          CategoryEntity,
          OrderEntity,
          ProductEntity,
          UserEntity,
        ],
        synchronize: false,
      }),
    }),
    CategoryModule,
    OrderModule,
    ProductModule,
    UserModule,
    AuthModule,
    CartModule,
    MonitoringModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
