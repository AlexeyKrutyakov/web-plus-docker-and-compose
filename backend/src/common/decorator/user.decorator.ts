import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';

export const AuthUser = createParamDecorator(
  (data: never, ctx: ExecutionContext): User => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
