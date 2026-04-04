import { ExecutionContext, createParamDecorator } from '@nestjs/common';

import { IUser } from '../interfaces';

export const User = createParamDecorator(
  (data: keyof IUser, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user: IUser = request.user;

    return data ? user[data] : user;
  },
);
