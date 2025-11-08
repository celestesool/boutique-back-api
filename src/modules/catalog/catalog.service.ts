import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
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

@Injectable()
export class CatalogService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
    @InjectRepository(Marca)
    private marcaRepository: Repository<Marca>,
    @InjectRepository(Color)
    private colorRepository: Repository<Color>,
    @InjectRepository(Talla)
    private tallaRepository: Repository<Talla>,
    @InjectRepository(Descuento)
    private descuentoRepository: Repository<Descuento>,
    @InjectRepository(CategoriaColor)
    private categoriaColorRepository: Repository<CategoriaColor>,
  ) {}

  // ==================== CATEGORIAS ====================
  async findAllCategorias(): Promise<Categoria[]> {
    return this.categoriaRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOneCategoria(id: string): Promise<Categoria> {
    const categoria = await this.categoriaRepository.findOne({ where: { id } });
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${id} no encontrada`);
    }
    return categoria;
  }

  async createCategoria(createCategoriaInput: CreateCategoriaInput): Promise<Categoria> {
    const existingCategoria = await this.categoriaRepository.findOne({
      where: { nombre: createCategoriaInput.nombre },
    });
    if (existingCategoria) {
      throw new BadRequestException(`Ya existe una categoría con el nombre "${createCategoriaInput.nombre}"`);
    }

    const categoria = this.categoriaRepository.create(createCategoriaInput);
    return this.categoriaRepository.save(categoria);
  }

  async updateCategoria(id: string, updateCategoriaInput: UpdateCategoriaInput): Promise<Categoria> {
    const categoria = await this.findOneCategoria(id);

    if (updateCategoriaInput.nombre && updateCategoriaInput.nombre !== categoria.nombre) {
      const existingCategoria = await this.categoriaRepository.findOne({
        where: { nombre: updateCategoriaInput.nombre },
      });
      if (existingCategoria) {
        throw new BadRequestException(`Ya existe una categoría con el nombre "${updateCategoriaInput.nombre}"`);
      }
    }

    Object.assign(categoria, updateCategoriaInput);
    return this.categoriaRepository.save(categoria);
  }

  async removeCategoria(id: string): Promise<boolean> {
    const categoria = await this.findOneCategoria(id);
    await this.categoriaRepository.remove(categoria);
    return true;
  }

  // ==================== MARCAS ====================
  async findAllMarcas(): Promise<Marca[]> {
    return this.marcaRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOneMarca(id: string): Promise<Marca> {
    const marca = await this.marcaRepository.findOne({ where: { id } });
    if (!marca) {
      throw new NotFoundException(`Marca con ID ${id} no encontrada`);
    }
    return marca;
  }

  async createMarca(createMarcaInput: CreateMarcaInput): Promise<Marca> {
    const existingMarca = await this.marcaRepository.findOne({
      where: { nombre: createMarcaInput.nombre },
    });
    if (existingMarca) {
      throw new BadRequestException(`Ya existe una marca con el nombre "${createMarcaInput.nombre}"`);
    }

    const marca = this.marcaRepository.create(createMarcaInput);
    return this.marcaRepository.save(marca);
  }

  async updateMarca(id: string, updateMarcaInput: UpdateMarcaInput): Promise<Marca> {
    const marca = await this.findOneMarca(id);

    if (updateMarcaInput.nombre && updateMarcaInput.nombre !== marca.nombre) {
      const existingMarca = await this.marcaRepository.findOne({
        where: { nombre: updateMarcaInput.nombre },
      });
      if (existingMarca) {
        throw new BadRequestException(`Ya existe una marca con el nombre "${updateMarcaInput.nombre}"`);
      }
    }

    Object.assign(marca, updateMarcaInput);
    return this.marcaRepository.save(marca);
  }

  async removeMarca(id: string): Promise<boolean> {
    const marca = await this.findOneMarca(id);
    await this.marcaRepository.remove(marca);
    return true;
  }

  // ==================== COLORES ====================
  async findAllColores(): Promise<Color[]> {
    return this.colorRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOneColor(id: string): Promise<Color> {
    const color = await this.colorRepository.findOne({ where: { id } });
    if (!color) {
      throw new NotFoundException(`Color con ID ${id} no encontrado`);
    }
    return color;
  }

  async createColor(createColorInput: CreateColorInput): Promise<Color> {
    const existingColor = await this.colorRepository.findOne({
      where: { nombre: createColorInput.nombre },
    });
    if (existingColor) {
      throw new BadRequestException(`Ya existe un color con el nombre "${createColorInput.nombre}"`);
    }

    const color = this.colorRepository.create(createColorInput);
    return this.colorRepository.save(color);
  }

  async updateColor(id: string, updateColorInput: UpdateColorInput): Promise<Color> {
    const color = await this.findOneColor(id);

    if (updateColorInput.nombre && updateColorInput.nombre !== color.nombre) {
      const existingColor = await this.colorRepository.findOne({
        where: { nombre: updateColorInput.nombre },
      });
      if (existingColor) {
        throw new BadRequestException(`Ya existe un color con el nombre "${updateColorInput.nombre}"`);
      }
    }

    Object.assign(color, updateColorInput);
    return this.colorRepository.save(color);
  }

  async removeColor(id: string): Promise<boolean> {
    const color = await this.findOneColor(id);
    await this.colorRepository.remove(color);
    return true;
  }

  // ==================== TALLAS ====================
  async findAllTallas(): Promise<Talla[]> {
    return this.tallaRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOneTalla(id: string): Promise<Talla> {
    const talla = await this.tallaRepository.findOne({ where: { id } });
    if (!talla) {
      throw new NotFoundException(`Talla con ID ${id} no encontrada`);
    }
    return talla;
  }

  async createTalla(createTallaInput: CreateTallaInput): Promise<Talla> {
    const existingTalla = await this.tallaRepository.findOne({
      where: { nombre: createTallaInput.nombre },
    });
    if (existingTalla) {
      throw new BadRequestException(`Ya existe una talla con el nombre "${createTallaInput.nombre}"`);
    }

    const talla = this.tallaRepository.create(createTallaInput);
    return this.tallaRepository.save(talla);
  }

  async updateTalla(id: string, updateTallaInput: UpdateTallaInput): Promise<Talla> {
    const talla = await this.findOneTalla(id);

    if (updateTallaInput.nombre && updateTallaInput.nombre !== talla.nombre) {
      const existingTalla = await this.tallaRepository.findOne({
        where: { nombre: updateTallaInput.nombre },
      });
      if (existingTalla) {
        throw new BadRequestException(`Ya existe una talla con el nombre "${updateTallaInput.nombre}"`);
      }
    }

    Object.assign(talla, updateTallaInput);
    return this.tallaRepository.save(talla);
  }

  async removeTalla(id: string): Promise<boolean> {
    const talla = await this.findOneTalla(id);
    await this.tallaRepository.remove(talla);
    return true;
  }

  // ==================== DESCUENTOS ====================
  async findAllDescuentos(): Promise<Descuento[]> {
    return this.descuentoRepository.find({ order: { fechaInicio: 'DESC' } });
  }

  async findOneDescuento(id: string): Promise<Descuento> {
    const descuento = await this.descuentoRepository.findOne({ where: { id } });
    if (!descuento) {
      throw new NotFoundException(`Descuento con ID ${id} no encontrado`);
    }
    return descuento;
  }

  async createDescuento(createDescuentoInput: CreateDescuentoInput): Promise<Descuento> {
    const { fechaInicio, fechaFin } = createDescuentoInput;
    
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
    }

    const descuento = this.descuentoRepository.create(createDescuentoInput);
    return this.descuentoRepository.save(descuento);
  }

  async updateDescuento(id: string, updateDescuentoInput: UpdateDescuentoInput): Promise<Descuento> {
    const descuento = await this.findOneDescuento(id);

    if (updateDescuentoInput.fechaInicio && updateDescuentoInput.fechaFin) {
      if (new Date(updateDescuentoInput.fechaFin) <= new Date(updateDescuentoInput.fechaInicio)) {
        throw new BadRequestException('La fecha de fin debe ser posterior a la fecha de inicio');
      }
    }

    Object.assign(descuento, updateDescuentoInput);
    return this.descuentoRepository.save(descuento);
  }

  async removeDescuento(id: string): Promise<boolean> {
    const descuento = await this.findOneDescuento(id);
    await this.descuentoRepository.remove(descuento);
    return true;
  }

  // ==================== CATEGORIAS COLORES ====================
  async findAllCategoriasColores(): Promise<CategoriaColor[]> {
    return this.categoriaColorRepository.find({
      relations: ['colores'],
      order: { nombre: 'ASC' },
    });
  }

  async findOneCategoriaColor(id: string): Promise<CategoriaColor> {
    const categoriaColor = await this.categoriaColorRepository.findOne({
      where: { id },
      relations: ['colores'],
    });
    if (!categoriaColor) {
      throw new NotFoundException(`Categoría de color con ID ${id} no encontrada`);
    }
    return categoriaColor;
  }

  async createCategoriaColor(createCategoriaColorInput: CreateCategoriaColorInput): Promise<CategoriaColor> {
    const existingCategoriaColor = await this.categoriaColorRepository.findOne({
      where: { nombre: createCategoriaColorInput.nombre },
    });
    if (existingCategoriaColor) {
      throw new BadRequestException(`Ya existe una categoría de color con el nombre "${createCategoriaColorInput.nombre}"`);
    }

    const categoriaColor = this.categoriaColorRepository.create({
      nombre: createCategoriaColorInput.nombre,
      descripcion: createCategoriaColorInput.descripcion,
      activo: createCategoriaColorInput.activo,
    });

    if (createCategoriaColorInput.coloresIds && createCategoriaColorInput.coloresIds.length > 0) {
      const colores = await this.colorRepository.findBy({
        id: In(createCategoriaColorInput.coloresIds),
      });
      
      if (colores.length !== createCategoriaColorInput.coloresIds.length) {
        throw new BadRequestException('Uno o más colores no existen');
      }
      
      categoriaColor.colores = colores;
    }

    return this.categoriaColorRepository.save(categoriaColor);
  }

  async updateCategoriaColor(id: string, updateCategoriaColorInput: UpdateCategoriaColorInput): Promise<CategoriaColor> {
    const categoriaColor = await this.findOneCategoriaColor(id);

    if (updateCategoriaColorInput.nombre && updateCategoriaColorInput.nombre !== categoriaColor.nombre) {
      const existingCategoriaColor = await this.categoriaColorRepository.findOne({
        where: { nombre: updateCategoriaColorInput.nombre },
      });
      if (existingCategoriaColor) {
        throw new BadRequestException(`Ya existe una categoría de color con el nombre "${updateCategoriaColorInput.nombre}"`);
      }
    }

    if (updateCategoriaColorInput.coloresIds) {
      const colores = await this.colorRepository.findBy({
        id: In(updateCategoriaColorInput.coloresIds),
      });
      
      if (colores.length !== updateCategoriaColorInput.coloresIds.length) {
        throw new BadRequestException('Uno o más colores no existen');
      }
      
      categoriaColor.colores = colores;
    }

    Object.assign(categoriaColor, {
      nombre: updateCategoriaColorInput.nombre,
      descripcion: updateCategoriaColorInput.descripcion,
      activo: updateCategoriaColorInput.activo,
    });

    return this.categoriaColorRepository.save(categoriaColor);
  }

  async removeCategoriaColor(id: string): Promise<boolean> {
    const categoriaColor = await this.findOneCategoriaColor(id);
    await this.categoriaColorRepository.remove(categoriaColor);
    return true;
  }
}
