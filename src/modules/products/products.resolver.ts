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

  // ==================== 🚀 QUERIES ML PARA MOBILE ====================

  /**
   * 📸 BÚSQUEDA VISUAL: Usuario toma foto → Buscar productos similares
   * USO MOBILE: Camera → Base64 → Este endpoint
   */
  @Query(() => [Product], { 
    description: '🔍 Búsqueda visual: Sube una foto y encuentra productos similares (Pinterest-style)' 
  })
  async buscarProductosPorImagen(
    @Args('imageBase64', { description: 'Imagen en formato base64' }) imageBase64: string,
    @Args('limit', { nullable: true, defaultValue: 20 }) limit: number,
  ): Promise<Product[]> {
    return this.productsService.buscarPorImagen(imageBase64, limit);
  }

  /**
   * 🎯 PRODUCTOS SIMILARES: "También te puede gustar"
   * USO MOBILE: En detalle de producto, mostrar grid de similares
   */
  @Query(() => [Product], { 
    description: '💡 Obtener productos visualmente similares (basado en ML)' 
  })
  async productosSimilares(
    @Args('productId') productId: string,
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
  ): Promise<Product[]> {
    return this.productsService.obtenerSimilares(productId, limit);
  }

  /**
   * 💎 RECOMENDACIONES PERSONALIZADAS: "Para ti"
   * USO MOBILE: Feed personalizado basado en historial del usuario
   */
  @Query(() => [Product], { 
    description: '🎁 Recomendaciones personalizadas basadas en tu historial' 
  })
  async recomendacionesParaTi(
    @Args('limit', { nullable: true, defaultValue: 10 }) limit: number,
    @Context() context: any,
  ): Promise<Product[]> {
    const user = await this.extractUserFromContext(context);
    return this.productsService.obtenerRecomendacionesUsuario(user.id, limit);
  }

  /**
   * 👁️ REGISTRAR VISTA: Cuando usuario ve un producto
   * USO MOBILE: Llamar automáticamente al abrir detalle del producto
   */
  @Mutation(() => Boolean, { 
    description: '📊 Registrar que el usuario vio un producto (para mejorar recomendaciones)' 
  })
  async registrarVistaProducto(
    @Args('productId') productId: string,
    @Context() context: any,
  ): Promise<boolean> {
    const user = await this.extractUserFromContext(context);
    await this.productsService.registrarInteraccion(user.id, productId, 'view');
    return true;
  }

  /**
   * ❤️ REGISTRAR LIKE: Cuando usuario da "me gusta"
   * USO MOBILE: Botón de favoritos en card de producto
   */
  @Mutation(() => Boolean, { 
    description: '❤️ Registrar like en un producto (mejora recomendaciones)' 
  })
  async darLikeProducto(
    @Args('productId') productId: string,
    @Context() context: any,
  ): Promise<boolean> {
    const user = await this.extractUserFromContext(context);
    await this.productsService.registrarInteraccion(user.id, productId, 'like');
    return true;
  }
}
