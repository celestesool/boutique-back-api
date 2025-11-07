import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { ProductFiltersInput } from './dto/product-filters.input';
import { PaginatedProductsResponse } from './dto/paginated-products.response';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find();
  }

  async findAllPaginated(
    pagination: PaginationInput,
    filters: ProductFiltersInput,
  ): Promise<PaginatedProductsResponse> {
    const { page = 1, limit = 10 } = pagination;
    const { categoria, precioMin, precioMax, buscar, ordenarPor = 'createdAt', orden = 'DESC' } = filters;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // Filtros
    if (categoria) {
      queryBuilder.andWhere('product.categoria = :categoria', { categoria });
    }

    if (precioMin !== undefined) {
      queryBuilder.andWhere('product.precio >= :precioMin', { precioMin });
    }

    if (precioMax !== undefined) {
      queryBuilder.andWhere('product.precio <= :precioMax', { precioMax });
    }

    if (buscar) {
      queryBuilder.andWhere(
        '(product.nombre ILIKE :buscar OR product.descripcion ILIKE :buscar)',
        { buscar: `%${buscar}%` }
      );
    }

    // Ordenamiento
    queryBuilder.orderBy(`product.${ordenarPor}`, orden);

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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException(`Producto ${id} no encontrado`);
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product = this.productRepository.create(input as any);
    const saved = await this.productRepository.save(product);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    await this.findOne(id);
    await this.productRepository.update(id, input as any);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await this.productRepository.delete(id);
  }

  async reduceStock(productId: string, cantidad: number): Promise<void> {
    const product = await this.findOne(productId);
    product.stock -= cantidad;
    await this.productRepository.save(product);
  }

  async increaseStock(productId: string, cantidad: number): Promise<void> {
    const product = await this.findOne(productId);
    product.stock += cantidad;
    await this.productRepository.save(product);
  }
}
