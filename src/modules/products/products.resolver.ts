import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { ProductFiltersInput } from './dto/product-filters.input';
import { PaginatedProductsResponse } from './dto/paginated-products.response';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/entities/user.entity';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  private async extractUserFromContext(context: any): Promise<User> {
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
      throw new UnauthorizedException('Invalid token: ' + error.message);
    }
  }

  @Query(() => [Product], { description: 'Obtener todos los productos (sin paginación)' })
  async getProducts(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => PaginatedProductsResponse, { description: 'Obtener productos paginados con filtros' })
  async getProductsPaginated(
    @Args('pagination', { type: () => PaginationInput, nullable: true }) pagination: PaginationInput = new PaginationInput(),
    @Args('filters', { type: () => ProductFiltersInput, nullable: true }) filters: ProductFiltersInput = new ProductFiltersInput(),
  ): Promise<PaginatedProductsResponse> {
    return this.productsService.findAllPaginated(pagination, filters);
  }

  @Query(() => Product, { nullable: true })
  async getProduct(@Args('id') id: string): Promise<Product> {
    return this.productsService.findOne(id);
  }

  @Mutation(() => Product)
  async createProduct(
    @Args('input') input: CreateProductInput,
    @Context() context: any,
  ): Promise<Product> {
    await this.extractUserFromContext(context);
    return this.productsService.create(input);
  }

  @Mutation(() => Product)
  async updateProduct(
    @Args('id') id: string,
    @Args('input') input: UpdateProductInput,
    @Context() context: any,
  ): Promise<Product> {
    await this.extractUserFromContext(context);
    return this.productsService.update(id, input);
  }

  @Mutation(() => Boolean)
  async deleteProduct(
    @Args('id') id: string,
    @Context() context: any,
  ): Promise<boolean> {
    await this.extractUserFromContext(context);
    await this.productsService.remove(id);
    return true;
  }
}
