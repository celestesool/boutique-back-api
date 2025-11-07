import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const req = ctx.req || context.switchToHttp().getRequest();
    
    if (req && req.user) {
      return req.user;
    }
    
    if (ctx && ctx.user) {
      return ctx.user;
    }
    
    return null;
  },
);

