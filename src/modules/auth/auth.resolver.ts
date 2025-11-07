import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql';
import { UseGuards, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { AuthResponse } from './dto/auth-response.dto';
import { User } from './entities/user.entity';
import { GqlJwtAuthGuard } from './guards/gql-jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Mutation(() => AuthResponse)
  async register(@Args('input') input: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(input);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginInput): Promise<AuthResponse> {
    return this.authService.login(input);
  }

  @Query(() => User)
  async me(@Context() context: any): Promise<User> {
    const authHeader = context.req?.headers?.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('No Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.authService.validateUser(payload.sub);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
