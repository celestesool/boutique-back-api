import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';
import { Descuento } from '../catalog/entities/descuento.entity';
import { AddToCartInput, UpdateCartItemInput, ApplyDiscountInput, RemoveFromCartInput } from './dto/cart.input';
import { MLService } from '../../ml/ml.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    @InjectRepository(CartItem)
    private readonly cartItemRepository: Repository<CartItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Descuento)
    private readonly descuentoRepository: Repository<Descuento>,
    private readonly mlService: MLService,
  ) {}

  // Obtener o crear carrito del usuario
  async obtenerOCrearCarrito(usuarioId: string): Promise<Cart> {
    const usuario = await this.userRepository.findOne({
      where: { id: usuarioId },
    });

    if (!usuario) {
      throw new NotFoundException('Usuario no encontrado');
    }

    let carrito = await this.cartRepository.findOne({
      where: { usuario: { id: usuarioId } },
      relations: ['items', 'items.producto'],
    });

    if (!carrito) {
      carrito = this.cartRepository.create({
        usuario,
        items: [],
        subtotal: 0,
        descuento: 0,
        total: 0,
      });
      await this.cartRepository.save(carrito);
    }

    return carrito;
  }

  // Agregar producto al carrito
  async agregarAlCarrito(input: AddToCartInput): Promise<Cart> {
    const carrito = await this.obtenerOCrearCarrito(input.usuarioId);

    const producto = await this.productRepository.findOne({
      where: { id: input.productoId },
    });

    if (!producto) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Verificar stock disponible
    if (producto.stock < input.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${producto.stock}`,
      );
    }

    // Verificar si el producto ya está en el carrito
    const itemExistente = carrito.items.find(
      (item) => item.producto.id === input.productoId,
    );

    if (itemExistente) {
      // Actualizar cantidad
      const nuevaCantidad = itemExistente.cantidad + input.cantidad;

      if (producto.stock < nuevaCantidad) {
        throw new BadRequestException(
          `Stock insuficiente. Disponible: ${producto.stock}`,
        );
      }

      itemExistente.cantidad = nuevaCantidad;
      itemExistente.subtotal = itemExistente.cantidad * itemExistente.precioUnitario;
      await this.cartItemRepository.save(itemExistente);
    } else {
      // Crear nuevo item
      const nuevoItem = this.cartItemRepository.create({
        carrito,
        producto,
        cantidad: input.cantidad,
        precioUnitario: producto.precio,
        subtotal: input.cantidad * producto.precio,
      });
      await this.cartItemRepository.save(nuevoItem);
    }

    // 🚀 REGISTRAR INTERACCIÓN ML: Producto agregado al carrito
    this.mlService.registrarInteraccion(input.usuarioId, input.productoId, 'cart')
      .catch(err => console.error('Error registrando interacción ML:', err.message));

    return this.actualizarTotales(carrito.id);
  }

  // Actualizar cantidad de un item
  async actualizarCantidad(input: UpdateCartItemInput): Promise<Cart> {
    const item = await this.cartItemRepository.findOne({
      where: { id: input.itemId },
      relations: ['carrito', 'producto'],
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    const producto = item.producto;

    // Verificar stock disponible
    if (producto.stock < input.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${producto.stock}`,
      );
    }

    item.cantidad = input.cantidad;
    item.subtotal = item.cantidad * item.precioUnitario;
    await this.cartItemRepository.save(item);

    return this.actualizarTotales(item.carrito.id);
  }

  // Eliminar item del carrito
  async eliminarDelCarrito(input: RemoveFromCartInput): Promise<Cart> {
    const item = await this.cartItemRepository.findOne({
      where: { id: input.itemId },
      relations: ['carrito'],
    });

    if (!item) {
      throw new NotFoundException('Item no encontrado en el carrito');
    }

    const carritoId = item.carrito.id;
    await this.cartItemRepository.remove(item);

    return this.actualizarTotales(carritoId);
  }

  // Limpiar carrito
  async limpiarCarrito(usuarioId: string): Promise<Cart> {
    const carrito = await this.obtenerOCrearCarrito(usuarioId);

    // Eliminar todos los items
    if (carrito.items.length > 0) {
      await this.cartItemRepository.remove(carrito.items);
    }

    carrito.items = [];
    carrito.subtotal = 0;
    carrito.descuento = 0;
    carrito.total = 0;
    carrito.codigoDescuento = null;

    return this.cartRepository.save(carrito);
  }

  // Aplicar código de descuento
  async aplicarDescuento(input: ApplyDiscountInput): Promise<Cart> {
    const carrito = await this.cartRepository.findOne({
      where: { id: input.carritoId },
      relations: ['items', 'items.producto'],
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    const descuento = await this.descuentoRepository.findOne({
      where: { nombre: input.codigoDescuento, activo: true },
    });

    if (!descuento) {
      throw new NotFoundException('Código de descuento inválido o inactivo');
    }

    // Verificar fechas de validez
    const ahora = new Date();
    if (descuento.fechaInicio && ahora < new Date(descuento.fechaInicio)) {
      throw new BadRequestException('Este descuento aún no está disponible');
    }
    if (descuento.fechaFin && ahora > new Date(descuento.fechaFin)) {
      throw new BadRequestException('Este descuento ha expirado');
    }

    // Aplicar descuento por porcentaje
    const montoDescuento = (carrito.subtotal * descuento.porcentaje) / 100;

    carrito.codigoDescuento = input.codigoDescuento;
    carrito.descuento = montoDescuento;
    carrito.total = Math.max(0, carrito.subtotal - montoDescuento);

    return this.cartRepository.save(carrito);
  }

  // Remover descuento
  async removerDescuento(carritoId: string): Promise<Cart> {
    const carrito = await this.cartRepository.findOne({
      where: { id: carritoId },
      relations: ['items', 'items.producto'],
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    carrito.codigoDescuento = null;
    carrito.descuento = 0;
    carrito.total = carrito.subtotal;

    return this.cartRepository.save(carrito);
  }

  // Actualizar totales del carrito
  private async actualizarTotales(carritoId: string): Promise<Cart> {
    const carrito = await this.cartRepository.findOne({
      where: { id: carritoId },
      relations: ['items', 'items.producto'],
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    // Calcular subtotal
    const subtotal = carrito.items.reduce(
      (sum, item) => sum + Number(item.subtotal),
      0,
    );

    carrito.subtotal = subtotal;

    // Recalcular descuento si existe
    if (carrito.codigoDescuento) {
      const descuento = await this.descuentoRepository.findOne({
        where: { nombre: carrito.codigoDescuento, activo: true },
      });

      if (descuento) {
        const montoDescuento = (subtotal * descuento.porcentaje) / 100;
        carrito.descuento = montoDescuento;
      } else {
        carrito.descuento = 0;
        carrito.codigoDescuento = null;
      }
    }

    carrito.total = Math.max(0, subtotal - carrito.descuento);

    return this.cartRepository.save(carrito);
  }

  // Obtener carrito por ID
  async findOne(id: string): Promise<Cart> {
    const carrito = await this.cartRepository.findOne({
      where: { id },
      relations: ['items', 'items.producto', 'usuario'],
    });

    if (!carrito) {
      throw new NotFoundException('Carrito no encontrado');
    }

    return carrito;
  }

  // Obtener carrito por usuario
  async obtenerCarritoPorUsuario(usuarioId: string): Promise<Cart> {
    return this.obtenerOCrearCarrito(usuarioId);
  }

  // Contar items en el carrito
  async contarItems(usuarioId: string): Promise<number> {
    const carrito = await this.obtenerOCrearCarrito(usuarioId);
    return carrito.items.reduce((sum, item) => sum + item.cantidad, 0);
  }
}
