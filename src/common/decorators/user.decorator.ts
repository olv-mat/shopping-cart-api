import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserInterface } from '../interfaces/user.interface';

export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext): UserInterface => {
    const request = context.switchToHttp().getRequest();
    return request.user as UserInterface;
  },
);
