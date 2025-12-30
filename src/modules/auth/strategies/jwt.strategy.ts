import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserInterface } from 'src/common/interfaces/user.interface';

/*
  Strategy That Extracts The JWT From The Authorization Header, Verifies Its 
  Validity Using The Secret Key, And Attaches The Decoded Payload To 'req.user'.
*/

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow('JWT_SECRET'),
    });
  }

  public async validate(payload: UserInterface) {
    return payload;
  }
}
