import { Resolver, Mutation, Query, Args, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { BusquedasService } from './busquedas.service';
import { Busqueda } from './entities/busqueda.entity';
import { CreateBusquedaInput } from './dto/create-busqueda.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Product } from '../products/entities/product.entity';

@Resolver(() => Busqueda)
export class BusquedasResolver {
  constructor(private readonly busquedasService: BusquedasService) {}

  @Mutation(() => Busqueda, { name: 'crearBusqueda' })
  @UseGuards(JwtAuthGuard)
  async crearBusqueda(
    @Args('createBusquedaInput') createBusquedaInput: CreateBusquedaInput,
    @CurrentUser() usuario: User,
  ): Promise<Busqueda> {
    return this.busquedasService.crearBusqueda(createBusquedaInput, usuario);
  }

  @Query(() => [Busqueda], { name: 'misBusquedas' })
  @UseGuards(JwtAuthGuard)
  async misBusquedas(@CurrentUser() usuario: User): Promise<Busqueda[]> {
    return this.busquedasService.misBusquedas(usuario);
  }

  @Query(() => [Product], { name: 'productosPopulares' })
  async productosPopulares(
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 })
    limit: number,
  ): Promise<Product[]> {
    return this.busquedasService.productosPopulares(limit);
  }

  @Query(() => [Busqueda], { name: 'historialBusquedas' })
  @UseGuards(JwtAuthGuard)
  async historialBusquedas(): Promise<Busqueda[]> {
    return this.busquedasService.historialBusquedas();
  }
}
