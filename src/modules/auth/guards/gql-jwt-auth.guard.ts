import { Injectable, UnauthorizedException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlJwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const req = ctx.req || {};

    // Extraer Authorization header
    const authHeader = (req.headers?.authorization || ctx.authHeader || '').trim();
    
    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header provided');
    }

    // Retornar request con headers correctos
    return {
      ...req,
      headers: {
        ...(req.headers || {}),
        authorization: authHeader,
      },
    };
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token or user not found');
    }
    return user;
  }
}
