import { InputType, Field, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min, MinLength, IsUUID, IsArray } from 'class-validator';

@InputType()
export class CreateProductInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @Field()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  @IsString({ message: 'La descripción debe ser texto' })
  @MinLength(10, { message: 'La descripción debe tener al menos 10 caracteres' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  descripcion: string;

  @Field(() => Float)
  @IsNotEmpty({ message: 'El precio es requerido' })
  @IsNumber({}, { message: 'El precio debe ser un número' })
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  precio: number;

  @Field()
  @IsNotEmpty({ message: 'El stock es requerido' })
  @IsNumber({}, { message: 'El stock debe ser un número' })
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La categoría debe ser texto' })
  @MaxLength(50, { message: 'La categoría no puede exceder 50 caracteres' })
  categoria?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUrl({}, { message: 'Debe ser una URL válida' })
  imagen_url?: string;

  @Field({ nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsNumber({}, { message: 'La popularidad debe ser un número' })
  @Min(0, { message: 'La popularidad no puede ser negativa' })
  popularidad?: number;

  // ==================== IDs PARA RELACIONES ====================

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'La categoría debe ser un UUID válido' })
  categoriaId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'La marca debe ser un UUID válido' })
  marcaId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'El descuento debe ser un UUID válido' })
  descuentoId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Los colores deben ser un arreglo' })
  @IsUUID('4', { each: true, message: 'Cada color debe ser un UUID válido' })
  coloresIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Las tallas deben ser un arreglo' })
  @IsUUID('4', { each: true, message: 'Cada talla debe ser un UUID válido' })
  tallasIds?: string[];
}

