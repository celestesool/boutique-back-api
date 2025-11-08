import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { PaginationInput } from '../../common/dto/pagination.input';
import { ProductFiltersInput } from './dto/product-filters.input';
import { PaginatedProductsResponse } from './dto/paginated-products.response';
import { Categoria } from '../catalog/entities/categoria.entity';
import { Marca } from '../catalog/entities/marca.entity';
import { Descuento } from '../catalog/entities/descuento.entity';
import { Color } from '../catalog/entities/color.entity';
import { Talla } from '../catalog/entities/talla.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
    @InjectRepository(Descuento)
    private descuentoRepository: Repository<Descuento>,
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
    @InjectRepository(Talla)
    private tallaRepository: Repository<Talla>,
  ) {}

  async findAll(): Promise<Product[]> {
    return this.productRepository.find({
      relations: ['categoriaRelacion', 'marca', 'descuento', 'colores', 'tallas'],
      order: { fecha_agregado: 'DESC' },
    });
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
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['categoriaRelacion', 'marca', 'descuento', 'colores', 'tallas'],
    });
    if (!product) throw new NotFoundException(`Producto ${id} no encontrado`);
    return product;
  }

  async create(input: CreateProductInput): Promise<Product> {
    const product = this.productRepository.create({
      nombre: input.nombre,
      descripcion: input.descripcion,
      precio: input.precio,
      stock: input.stock,
      categoria: input.categoria,
      imagen_url: input.imagen_url,
      popularidad: input.popularidad ?? 0,
    });

    // Asignar relaciones
    if (input.categoriaId) {
      const categoria = await this.categoriaRepository.findOne({ where: { id: input.categoriaId } });
      if (!categoria) throw new BadRequestException('Categoría no encontrada');
      product.categoriaRelacion = categoria;
    }

    if (input.marcaId) {
      const marca = await this.marcaRepository.findOne({ where: { id: input.marcaId } });
      if (!marca) throw new BadRequestException('Marca no encontrada');
      product.marca = marca;
    }

    if (input.descuentoId) {
      const descuento = await this.descuentoRepository.findOne({ where: { id: input.descuentoId } });
      if (!descuento) throw new BadRequestException('Descuento no encontrado');
      product.descuento = descuento;
    }

    if (input.coloresIds && input.coloresIds.length > 0) {
      const colores = await this.colorRepository.findBy({ id: In(input.coloresIds) });
      if (colores.length !== input.coloresIds.length) {
        throw new BadRequestException('Uno o más colores no existen');
      }
      product.colores = colores;
    }

    if (input.tallasIds && input.tallasIds.length > 0) {
      const tallas = await this.tallaRepository.findBy({ id: In(input.tallasIds) });
      if (tallas.length !== input.tallasIds.length) {
        throw new BadRequestException('Una o más tallas no existen');
      }
      product.tallas = tallas;
    }

    const saved = await this.productRepository.save(product);
    return this.findOne(saved.id);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const product = await this.findOne(id);

    // Actualizar campos básicos
    Object.assign(product, {
      nombre: input.nombre ?? product.nombre,
      descripcion: input.descripcion ?? product.descripcion,
      precio: input.precio ?? product.precio,
      stock: input.stock ?? product.stock,
      categoria: input.categoria ?? product.categoria,
      imagen_url: input.imagen_url ?? product.imagen_url,
      popularidad: input.popularidad ?? product.popularidad,
    });

    // Actualizar relaciones si se proporcionan
    if (input.categoriaId !== undefined) {
      if (input.categoriaId === null) {
        product.categoriaRelacion = null;
      } else {
        const categoria = await this.categoriaRepository.findOne({ where: { id: input.categoriaId } });
        if (!categoria) throw new BadRequestException('Categoría no encontrada');
        product.categoriaRelacion = categoria;
      }
    }

    if (input.marcaId !== undefined) {
      if (input.marcaId === null) {
        product.marca = null;
      } else {
        const marca = await this.marcaRepository.findOne({ where: { id: input.marcaId } });
        if (!marca) throw new BadRequestException('Marca no encontrada');
        product.marca = marca;
      }
    }

    if (input.descuentoId !== undefined) {
      if (input.descuentoId === null) {
        product.descuento = null;
      } else {
        const descuento = await this.descuentoRepository.findOne({ where: { id: input.descuentoId } });
        if (!descuento) throw new BadRequestException('Descuento no encontrado');
        product.descuento = descuento;
      }
    }

    if (input.coloresIds !== undefined) {
      if (input.coloresIds.length === 0) {
        product.colores = [];
      } else {
        const colores = await this.colorRepository.findBy({ id: In(input.coloresIds) });
        if (colores.length !== input.coloresIds.length) {
          throw new BadRequestException('Uno o más colores no existen');
        }
        product.colores = colores;
      }
    }

    if (input.tallasIds !== undefined) {
      if (input.tallasIds.length === 0) {
        product.tallas = [];
      } else {
        const tallas = await this.tallaRepository.findBy({ id: In(input.tallasIds) });
        if (tallas.length !== input.tallasIds.length) {
          throw new BadRequestException('Una o más tallas no existen');
        }
        product.tallas = tallas;
      }
    }

    await this.productRepository.save(product);
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
