import { Resolver, Mutation, Query, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { NotasIngresoService } from './notas-ingreso.service';
import { NotaIngreso } from './entities/nota-ingreso.entity';
import { CreateNotaIngresoInput } from './dto/create-nota-ingreso.input';
import { UpdateEstadoNotaIngresoInput } from './dto/update-nota-ingreso.input';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/entities/user.entity';

@Resolver(() => NotaIngreso)
export class NotasIngresoResolver {
  constructor(private readonly notasIngresoService: NotasIngresoService) {}

  @Mutation(() => NotaIngreso, { name: 'crearNotaIngreso' })
  @UseGuards(JwtAuthGuard)
  async crearNotaIngreso(
    @Args('createNotaIngresoInput') createNotaIngresoInput: CreateNotaIngresoInput,
    @CurrentUser() usuario: User,
  ): Promise<NotaIngreso> {
    return this.notasIngresoService.crearNotaIngreso(
      createNotaIngresoInput,
      usuario,
    );
  }

  @Query(() => [NotaIngreso], { name: 'obtenerNotasIngreso' })
  @UseGuards(JwtAuthGuard)
  async obtenerNotasIngreso(): Promise<NotaIngreso[]> {
    return this.notasIngresoService.obtenerNotasIngreso();
  }

  @Query(() => NotaIngreso, { name: 'obtenerNotaIngresoPorId' })
  @UseGuards(JwtAuthGuard)
  async obtenerNotaIngresoPorId(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<NotaIngreso> {
    return this.notasIngresoService.obtenerNotaIngresoPorId(id);
  }

  @Mutation(() => NotaIngreso, { name: 'actualizarEstadoNotaIngreso' })
  @UseGuards(JwtAuthGuard)
  async actualizarEstadoNotaIngreso(
    @Args('id', { type: () => ID }) id: string,
    @Args('updateEstadoInput') updateEstadoInput: UpdateEstadoNotaIngresoInput,
  ): Promise<NotaIngreso> {
    return this.notasIngresoService.actualizarEstado(id, updateEstadoInput);
  }

  @Query(() => [NotaIngreso], { name: 'misNotasIngreso' })
  @UseGuards(JwtAuthGuard)
  async misNotasIngreso(@CurrentUser() usuario: User): Promise<NotaIngreso[]> {
    return this.notasIngresoService.misNotasIngreso(usuario);
  }
}
