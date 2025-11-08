import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CatalogService } from './catalog.service';
import { Categoria } from './entities/categoria.entity';
import { Marca } from './entities/marca.entity';
import { Color } from './entities/color.entity';
import { Talla } from './entities/talla.entity';
import { Descuento } from './entities/descuento.entity';
import { CategoriaColor } from './entities/categoria-color.entity';
import { CreateCategoriaInput } from './dto/create-categoria.input';
import { UpdateCategoriaInput } from './dto/update-categoria.input';
import { CreateMarcaInput } from './dto/create-marca.input';
import { UpdateMarcaInput } from './dto/update-marca.input';
import { CreateColorInput } from './dto/create-color.input';
import { UpdateColorInput } from './dto/update-color.input';
import { CreateTallaInput } from './dto/create-talla.input';
import { UpdateTallaInput } from './dto/update-talla.input';
import { CreateDescuentoInput } from './dto/create-descuento.input';
import { UpdateDescuentoInput } from './dto/update-descuento.input';
import { CreateCategoriaColorInput } from './dto/create-categoria-color.input';
import { UpdateCategoriaColorInput } from './dto/update-categoria-color.input';

@Resolver()
export class CatalogResolver {
  constructor(private readonly catalogService: CatalogService) {}

  // ==================== CATEGORIAS ====================
  @Query(() => [Categoria], { name: 'getCategorias' })
  async getCategorias(): Promise<Categoria[]> {
    return this.catalogService.findAllCategorias();
  }

  @Query(() => Categoria, { name: 'getCategoria' })
  async getCategoria(@Args('id') id: string): Promise<Categoria> {
    return this.catalogService.findOneCategoria(id);
  }

  @Mutation(() => Categoria, { name: 'crearCategoria' })
  async crearCategoria(@Args('input') input: CreateCategoriaInput): Promise<Categoria> {
    return this.catalogService.createCategoria(input);
  }

  @Mutation(() => Categoria, { name: 'actualizarCategoria' })
  async actualizarCategoria(
    @Args('id') id: string,
    @Args('input') input: UpdateCategoriaInput,
  ): Promise<Categoria> {
    return this.catalogService.updateCategoria(id, input);
  }

  @Mutation(() => Boolean, { name: 'eliminarCategoria' })
  async eliminarCategoria(@Args('id') id: string): Promise<boolean> {
    return this.catalogService.removeCategoria(id);
  }

  // ==================== MARCAS ====================
  @Query(() => [Marca], { name: 'getMarcas' })
  async getMarcas(): Promise<Marca[]> {
    return this.catalogService.findAllMarcas();
  }

  @Query(() => Marca, { name: 'getMarca' })
  async getMarca(@Args('id') id: string): Promise<Marca> {
    return this.catalogService.findOneMarca(id);
  }

  @Mutation(() => Marca, { name: 'crearMarca' })
  async crearMarca(@Args('input') input: CreateMarcaInput): Promise<Marca> {
    return this.catalogService.createMarca(input);
  }

  @Mutation(() => Marca, { name: 'actualizarMarca' })
  async actualizarMarca(
    @Args('id') id: string,
    @Args('input') input: UpdateMarcaInput,
  ): Promise<Marca> {
    return this.catalogService.updateMarca(id, input);
  }

  @Mutation(() => Boolean, { name: 'eliminarMarca' })
  async eliminarMarca(@Args('id') id: string): Promise<boolean> {
    return this.catalogService.removeMarca(id);
  }

  // ==================== COLORES ====================
  @Query(() => [Color], { name: 'getColores' })
  async getColores(): Promise<Color[]> {
    return this.catalogService.findAllColores();
  }

  @Query(() => Color, { name: 'getColor' })
  async getColor(@Args('id') id: string): Promise<Color> {
    return this.catalogService.findOneColor(id);
  }

  @Mutation(() => Color, { name: 'crearColor' })
  async crearColor(@Args('input') input: CreateColorInput): Promise<Color> {
    return this.catalogService.createColor(input);
  }

  @Mutation(() => Color, { name: 'actualizarColor' })
  async actualizarColor(
    @Args('id') id: string,
    @Args('input') input: UpdateColorInput,
  ): Promise<Color> {
    return this.catalogService.updateColor(id, input);
  }

  @Mutation(() => Boolean, { name: 'eliminarColor' })
  async eliminarColor(@Args('id') id: string): Promise<boolean> {
    return this.catalogService.removeColor(id);
  }

  // ==================== TALLAS ====================
  @Query(() => [Talla], { name: 'getTallas' })
  async getTallas(): Promise<Talla[]> {
    return this.catalogService.findAllTallas();
  }

  @Query(() => Talla, { name: 'getTalla' })
  async getTalla(@Args('id') id: string): Promise<Talla> {
    return this.catalogService.findOneTalla(id);
  }

  @Mutation(() => Talla, { name: 'crearTalla' })
  async crearTalla(@Args('input') input: CreateTallaInput): Promise<Talla> {
    return this.catalogService.createTalla(input);
  }

  @Mutation(() => Talla, { name: 'actualizarTalla' })
  async actualizarTalla(
    @Args('id') id: string,
    @Args('input') input: UpdateTallaInput,
  ): Promise<Talla> {
    return this.catalogService.updateTalla(id, input);
  }

  @Mutation(() => Boolean, { name: 'eliminarTalla' })
  async eliminarTalla(@Args('id') id: string): Promise<boolean> {
    return this.catalogService.removeTalla(id);
  }

  // ==================== DESCUENTOS ====================
  @Query(() => [Descuento], { name: 'getDescuentos' })
  async getDescuentos(): Promise<Descuento[]> {
    return this.catalogService.findAllDescuentos();
  }

  @Query(() => Descuento, { name: 'getDescuento' })
  async getDescuento(@Args('id') id: string): Promise<Descuento> {
    return this.catalogService.findOneDescuento(id);
  }

  @Mutation(() => Descuento, { name: 'crearDescuento' })
  async crearDescuento(@Args('input') input: CreateDescuentoInput): Promise<Descuento> {
    return this.catalogService.createDescuento(input);
  }

  @Mutation(() => Descuento, { name: 'actualizarDescuento' })
  async actualizarDescuento(
    @Args('id') id: string,
    @Args('input') input: UpdateDescuentoInput,
  ): Promise<Descuento> {
    return this.catalogService.updateDescuento(id, input);
  }

  @Mutation(() => Boolean, { name: 'eliminarDescuento' })
  async eliminarDescuento(@Args('id') id: string): Promise<boolean> {
    return this.catalogService.removeDescuento(id);
  }

  // ==================== CATEGORIAS COLORES ====================
  @Query(() => [CategoriaColor], { name: 'getCategoriasColores' })
  async getCategoriasColores(): Promise<CategoriaColor[]> {
    return this.catalogService.findAllCategoriasColores();
  }

  @Query(() => CategoriaColor, { name: 'getCategoriaColor' })
  async getCategoriaColor(@Args('id') id: string): Promise<CategoriaColor> {
    return this.catalogService.findOneCategoriaColor(id);
  }

  @Mutation(() => CategoriaColor, { name: 'crearCategoriaColor' })
  async crearCategoriaColor(@Args('input') input: CreateCategoriaColorInput): Promise<CategoriaColor> {
    return this.catalogService.createCategoriaColor(input);
  }

  @Mutation(() => CategoriaColor, { name: 'actualizarCategoriaColor' })
  async actualizarCategoriaColor(
    @Args('id') id: string,
    @Args('input') input: UpdateCategoriaColorInput,
  ): Promise<CategoriaColor> {
    return this.catalogService.updateCategoriaColor(id, input);
  }

  @Mutation(() => Boolean, { name: 'eliminarCategoriaColor' })
  async eliminarCategoriaColor(@Args('id') id: string): Promise<boolean> {
    return this.catalogService.removeCategoriaColor(id);
  }
}
