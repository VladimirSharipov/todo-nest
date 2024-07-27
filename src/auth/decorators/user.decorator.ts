import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { User } from 'types/users.types';

export const CurrentUser = createParamDecorator(
  (data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user[data] : user;
  },
);
