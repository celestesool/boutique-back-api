import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Busqueda } from './entities/busqueda.entity';
import { CreateBusquedaInput } from './dto/create-busqueda.input';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Injectable()
export class BusquedasService {
  constructor(
    @InjectRepository(Busqueda)
    private readonly busquedaRepository: Repository<Busqueda>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async crearBusqueda(
    createBusquedaInput: CreateBusquedaInput,
    usuario: User,
  ): Promise<Busqueda> {
    // Verificar que el producto existe
    const producto = await this.productRepository.findOne({
      where: { id: createBusquedaInput.productoId },
    });

    if (!producto) {
      throw new NotFoundException(
        `Producto con ID ${createBusquedaInput.productoId} no encontrado`,
      );
    }

    // Incrementar popularidad del producto
    producto.popularidad = (producto.popularidad || 0) + 1;
    await this.productRepository.save(producto);

    // Crear la búsqueda
    const busqueda = this.busquedaRepository.create({
      usuario,
      producto,
      resultado: createBusquedaInput.resultado || 'éxito',
    });

    return this.busquedaRepository.save(busqueda);
  }

  async misBusquedas(usuario: User): Promise<Busqueda[]> {
    return this.busquedaRepository.find({
      where: { usuario: { id: usuario.id } },
      relations: ['producto', 'producto.categoriaRelacion', 'producto.marca'],
      order: { fecha_busqueda: 'DESC' },
      take: 50, // Últimas 50 búsquedas
    });
  }

  async productosPopulares(limit: number = 10): Promise<Product[]> {
    return this.productRepository.find({
      order: { popularidad: 'DESC' },
      take: limit,
      relations: ['categoriaRelacion', 'marca', 'colores', 'tallas'],
    });
  }

  async historialBusquedas(): Promise<Busqueda[]> {
    return this.busquedaRepository.find({
      relations: ['usuario', 'producto'],
      order: { fecha_busqueda: 'DESC' },
      take: 100,
    });
  }
}
