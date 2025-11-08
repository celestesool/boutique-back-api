import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { AddToCartInput, UpdateCartItemInput, ApplyDiscountInput, RemoveFromCartInput } from './dto/cart.input';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private readonly cartService: CartService) {}

  @Query(() => Cart, { name: 'miCarrito', description: 'Obtener carrito del usuario' })
  async obtenerCarrito(
    @Args('usuarioId', { type: () => ID }) usuarioId: string,
  ): Promise<Cart> {
    return this.cartService.obtenerCarritoPorUsuario(usuarioId);
  }

  @Query(() => Cart, { name: 'carrito', description: 'Obtener carrito por ID' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<Cart> {
    return this.cartService.findOne(id);
  }

  @Query(() => Int, { name: 'contarItemsCarrito', description: 'Contar items en el carrito' })
  async contarItems(
    @Args('usuarioId', { type: () => ID }) usuarioId: string,
  ): Promise<number> {
    return this.cartService.contarItems(usuarioId);
  }

  @Mutation(() => Cart, { description: 'Agregar producto al carrito' })
  async agregarAlCarrito(
    @Args('input') input: AddToCartInput,
  ): Promise<Cart> {
    return this.cartService.agregarAlCarrito(input);
  }

  @Mutation(() => Cart, { description: 'Actualizar cantidad de un item del carrito' })
  async actualizarCantidadCarrito(
    @Args('input') input: UpdateCartItemInput,
  ): Promise<Cart> {
    return this.cartService.actualizarCantidad(input);
  }

  @Mutation(() => Cart, { description: 'Eliminar item del carrito' })
  async eliminarDelCarrito(
    @Args('input') input: RemoveFromCartInput,
  ): Promise<Cart> {
    return this.cartService.eliminarDelCarrito(input);
  }

  @Mutation(() => Cart, { description: 'Limpiar todo el carrito' })
  async limpiarCarrito(
    @Args('usuarioId', { type: () => ID }) usuarioId: string,
  ): Promise<Cart> {
    return this.cartService.limpiarCarrito(usuarioId);
  }

  @Mutation(() => Cart, { description: 'Aplicar código de descuento al carrito' })
  async aplicarDescuentoCarrito(
    @Args('input') input: ApplyDiscountInput,
  ): Promise<Cart> {
    return this.cartService.aplicarDescuento(input);
  }

  @Mutation(() => Cart, { description: 'Remover descuento del carrito' })
  async removerDescuentoCarrito(
    @Args('carritoId', { type: () => ID }) carritoId: string,
  ): Promise<Cart> {
    return this.cartService.removerDescuento(carritoId);
  }
}
