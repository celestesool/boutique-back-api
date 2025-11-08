import { Resolver, Query, Mutation, Args, ID, ObjectType, Field, Float, Int } from '@nestjs/graphql';
import { NotasVentaService } from './notas-venta.service';
import { NotaVenta } from './entities/nota-venta.entity';
import { CreateNotaVentaInput } from './dto/create-nota-venta.input';
import { UpdateNotaVentaInput } from './dto/update-nota-venta.input';

@ObjectType()
class EstadisticasVentas {
  @Field(() => Int)
  totalVentas: number;

  @Field(() => Int)
  ventasProcesadas: number;

  @Field(() => Int)
  ventasPendientes: number;

  @Field(() => Int)
  ventasCanceladas: number;

  @Field(() => Float)
  montoTotal: number;
}

@Resolver(() => NotaVenta)
export class NotasVentaResolver {
  constructor(private readonly notasVentaService: NotasVentaService) {}

  @Mutation(() => NotaVenta, { description: 'Crear una nueva nota de venta' })
  async crearNotaVenta(
    @Args('input') input: CreateNotaVentaInput,
  ): Promise<NotaVenta> {
    return this.notasVentaService.crearNotaVenta(input);
  }

  @Query(() => [NotaVenta], { name: 'notasVenta', description: 'Obtener todas las notas de venta' })
  async findAll(): Promise<NotaVenta[]> {
    return this.notasVentaService.findAll();
  }

  @Query(() => NotaVenta, { name: 'notaVenta', description: 'Obtener una nota de venta por ID' })
  async findOne(@Args('id', { type: () => ID }) id: string): Promise<NotaVenta> {
    return this.notasVentaService.findOne(id);
  }

  @Query(() => [NotaVenta], { name: 'misNotasVenta', description: 'Obtener notas de venta por usuario' })
  async findByUsuario(
    @Args('usuarioId', { type: () => ID }) usuarioId: string,
  ): Promise<NotaVenta[]> {
    return this.notasVentaService.findByUsuario(usuarioId);
  }

  @Mutation(() => NotaVenta, { description: 'Actualizar estado de una nota de venta' })
  async actualizarEstadoNotaVenta(
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateNotaVentaInput,
  ): Promise<NotaVenta> {
    return this.notasVentaService.actualizarEstado(id, input);
  }

  @Mutation(() => NotaVenta, { description: 'Procesar una nota de venta (descontar stock)' })
  async procesarNotaVenta(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<NotaVenta> {
    return this.notasVentaService.actualizarEstado(id, {
      estado: 'procesada' as any,
    });
  }

  @Mutation(() => NotaVenta, { description: 'Cancelar una nota de venta' })
  async cancelarNotaVenta(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<NotaVenta> {
    return this.notasVentaService.cancelarNotaVenta(id);
  }

  @Mutation(() => NotaVenta, { description: 'Eliminar una nota de venta' })
  async eliminarNotaVenta(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<NotaVenta> {
    return this.notasVentaService.remove(id);
  }

  @Query(() => EstadisticasVentas, { name: 'estadisticasVentas', description: 'Obtener estadísticas de ventas' })
  async obtenerEstadisticas(): Promise<EstadisticasVentas> {
    return this.notasVentaService.obtenerEstadisticas();
  }
}
