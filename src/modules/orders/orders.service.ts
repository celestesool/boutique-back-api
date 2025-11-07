import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderInput } from './dto/create-order.input';
import { UpdateOrderInput } from './dto/update-order.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { OrderFiltersInput } from './dto/order-filters.input';
import { PaginatedOrdersResponse } from './dto/paginated-orders.response';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
  ) {}

  async create(userId: string, input: CreateOrderInput): Promise<Order> {
    if (!input.items || input.items.length === 0) {
      throw new BadRequestException('La orden debe tener al menos un producto');
    }

    // Validar y obtener productos
    let subtotal = 0;
    const orderItems: OrderItem[] = [];

    for (const item of input.items) {
      const product = await this.productsService.findOne(item.productId);
      if (!product) {
        throw new NotFoundException(`Producto ${item.productId} no encontrado`);
      }

      if (product.stock < item.cantidad) {
        throw new BadRequestException(
          `Stock insuficiente para ${product.nombre}. Disponible: ${product.stock}`,
        );
      }

      const itemSubtotal = Number(product.precio) * item.cantidad;
      subtotal += itemSubtotal;

      const orderItem = this.orderItemRepository.create({
        productId: item.productId,
        cantidad: item.cantidad,
        precioUnitario: product.precio,
        subtotal: itemSubtotal,
      });
      orderItems.push(orderItem);
    }

    // Calcular impuestos y envío
    const impuestos = subtotal * 0.19; // 19% IVA
    const envio = subtotal > 100 ? 0 : 10; // Envío gratis si > 100
    const total = subtotal + impuestos + envio;

    // Crear orden
    const order = this.orderRepository.create({
      userId,
      items: orderItems,
      subtotal,
      impuestos,
      envio,
      total,
      estado: OrderStatus.PENDIENTE,
    });

    // Guardar orden
    const savedOrder = await this.orderRepository.save(order);

    // Reducir stock de productos
    for (const item of input.items) {
      await this.productsService.reduceStock(item.productId, item.cantidad);
    }

    return this.findOne(savedOrder.id);
  }

  async findAll(userId?: string): Promise<Order[]> {
    const query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    if (userId) {
      query.where('order.userId = :userId', { userId });
    }

    return query.orderBy('order.createdAt', 'DESC').getMany();
  }

  async findAllPaginated(
    userId: string | undefined,
    pagination: PaginationInput,
    filters: OrderFiltersInput,
  ): Promise<PaginatedOrdersResponse> {
    const { page = 1, limit = 10 } = pagination;
    const { estado, ordenarPor = 'createdAt', orden = 'DESC' } = filters;

    const queryBuilder = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.user', 'user')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    // Filtrar por usuario si se proporciona
    if (userId) {
      queryBuilder.andWhere('order.userId = :userId', { userId });
    }

    // Filtrar por estado
    if (estado) {
      queryBuilder.andWhere('order.estado = :estado', { estado });
    }

    // Ordenamiento
    queryBuilder.orderBy(`order.${ordenarPor}`, orden);

    // Paginación
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, totalItems] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      pageInfo: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['user', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Orden ${id} no encontrada`);
    }

    return order;
  }

  async update(id: string, input: UpdateOrderInput): Promise<Order> {
    const order = await this.findOne(id);

    if (input.estado) {
      order.estado = input.estado;
    }

    if (input.numeroSeguimiento) {
      order.numeroSeguimiento = input.numeroSeguimiento;
    }

    await this.orderRepository.save(order);
    return this.findOne(id);
  }

  async remove(id: string): Promise<boolean> {
    const order = await this.findOne(id);
    
    // Restaurar stock
    for (const item of order.items) {
      await this.productsService.increaseStock(item.productId, item.cantidad);
    }

    await this.orderRepository.remove(order);
    return true;
  }
}
