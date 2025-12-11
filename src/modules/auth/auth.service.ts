import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserInterface } from 'src/common/interfaces/user.interface';
import { UserEntity } from '../user/entities/user.entity';

/* 
  npm install bcrypt
  npm install --D @types/bcrypt 
*/

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  public async authenticate(
    password: string,
    userEntity: UserEntity,
  ): Promise<string> {
    const isValidPassword = await bcrypt.compare(password, userEntity.password);
    if (!isValidPassword) throw new UnauthorizedException('Invalid password');
    return this.generateToken(userEntity);
  }

  public generateToken(userEntity: UserEntity): string {
    const payload: UserInterface = {
      sub: userEntity.id,
      name: userEntity.name,
      email: userEntity.email,
      role: userEntity.role,
    };
    return this.jwtService.sign(payload);
  }
}
