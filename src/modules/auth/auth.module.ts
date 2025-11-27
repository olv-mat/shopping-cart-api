import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthFacade } from './auth.facade';
import { AuthService } from './auth.service';
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
    CartModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthFacade, AuthService, JwtStrategy],
})
export class AuthModule {}
