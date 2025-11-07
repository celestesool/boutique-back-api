import { Resolver, Query, Mutation, Args, ID, Context } from '@nestjs/graphql';
import { BadRequestException } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { OrderFiltersInput } from './dto/order-filters.input';
import { PaginatedOrdersResponse } from './dto/paginated-orders.response';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  private async extractUserFromContext(context: any): Promise<{ id: string; rol: string }> {
    const authHeader = context.req?.headers?.authorization;

    if (!authHeader) {
      throw new BadRequestException('No Authorization header');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = this.jwtService.verify(token);
      const user = await this.authService.validateUser(payload.sub);

      if (!user) {
        throw new BadRequestException('User not found');
      }

      return { id: user.id, rol: user.rol };
    } catch (error) {
      throw new BadRequestException('Invalid token: ' + error.message);
    }
  }

  @Query(() => [Order])
  async misOrdenes(@Context() context: any): Promise<Order[]> {
    const user = await this.extractUserFromContext(context);
    return this.ordersService.findAll(user.id);
  }

  @Query(() => PaginatedOrdersResponse, { description: 'Obtener mis órdenes paginadas' })
  async misOrdenesPaginadas(
    @Context() context: any,
    @Args('pagination', { type: () => PaginationInput, nullable: true }) pagination: PaginationInput = new PaginationInput(),
    @Args('filters', { type: () => OrderFiltersInput, nullable: true }) filters: OrderFiltersInput = new OrderFiltersInput(),
  ): Promise<PaginatedOrdersResponse> {
    const user = await this.extractUserFromContext(context);
    return this.ordersService.findAllPaginated(user.id, pagination, filters);
  }

  @Query(() => Order)
  async orden(@Args('id', { type: () => ID }) id: string): Promise<Order> {
    return this.ordersService.findOne(id);
  }

  @Query(() => [Order])
  async todasLasOrdenes(@Context() context: any): Promise<Order[]> {
    const user = await this.extractUserFromContext(context);

    // Solo admins pueden ver todas las órdenes
    if (user.rol !== 'admin') {
      throw new BadRequestException('Solo administradores pueden ver todas las órdenes');
    }

    return this.ordersService.findAll();
  }

  @Query(() => PaginatedOrdersResponse, { description: 'Obtener todas las órdenes paginadas (admin)' })
  async todasLasOrdenesPaginadas(
    @Context() context: any,
    @Args('pagination', { type: () => PaginationInput, nullable: true }) pagination: PaginationInput = new PaginationInput(),
    @Args('filters', { type: () => OrderFiltersInput, nullable: true }) filters: OrderFiltersInput = new OrderFiltersInput(),
  ): Promise<PaginatedOrdersResponse> {
    const user = await this.extractUserFromContext(context);

    // Solo admins pueden ver todas las órdenes
    if (user.rol !== 'admin') {
      throw new BadRequestException('Solo administradores pueden ver todas las órdenes');
    }

    return this.ordersService.findAllPaginated(undefined, pagination, filters);
  }

  @Mutation(() => Order)
  async crearOrden(
    @Args('input') input: CreateOrderInput,
    @Context() context: any,
  ): Promise<Order> {
    const user = await this.extractUserFromContext(context);
    return this.ordersService.create(user.id, input);
  }

  @Mutation(() => Order)
  async actualizarOrden(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateOrderInput,
    @Context() context: any,
  ): Promise<Order> {
    const user = await this.extractUserFromContext(context);

    // Verificar que el usuario sea admin o dueño de la orden
    const order = await this.ordersService.findOne(id);
    if (user.rol !== 'admin' && order.userId !== user.id) {
      throw new BadRequestException('No tienes permiso para actualizar esta orden');
    }

    return this.ordersService.update(id, input);
  }

  @Mutation(() => Boolean)
  async eliminarOrden(
    @Args('id', { type: () => ID }) id: string,
    @Context() context: any,
  ): Promise<boolean> {
    const user = await this.extractUserFromContext(context);

    // Solo admins pueden eliminar órdenes
    if (user.rol !== 'admin') {
      throw new BadRequestException('Solo administradores pueden eliminar órdenes');
    }

    return this.ordersService.remove(id);
  }
}
