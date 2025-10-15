import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartModule } from '../cart/cart.module';
import { CartEntity } from '../cart/entities/cart.entity';
import { UserEntity } from '../user/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthResponseMapper } from './mappers/auth-response.mapper';
import { JwtStrategy } from './strategies/jwt.strategy';

/* 
  npm install @nestjs/passport passport @nestjs/jwt passport-jwt
  npm install -D @types/passport-jwt
*/

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    TypeOrmModule.forFeature([UserEntity, CartEntity]),
    CartModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, AuthResponseMapper],
})
export class AuthModule {}
