import { InputType, Field, Float } from '@nestjs/graphql';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class ProductFiltersInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La categoría debe ser texto' })
  categoria?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'El precio mínimo debe ser un número' })
  @Min(0, { message: 'El precio mínimo no puede ser negativo' })
  precioMin?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber({}, { message: 'El precio máximo debe ser un número' })
  @Min(0, { message: 'El precio máximo no puede ser negativo' })
  precioMax?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El término de búsqueda debe ser texto' })
  buscar?: string;

  @Field({ nullable: true, defaultValue: 'createdAt' })
  @IsOptional()
  @IsString()
  ordenarPor?: string = 'createdAt';

  @Field({ nullable: true, defaultValue: 'DESC' })
  @IsOptional()
  @IsString()
  orden?: 'ASC' | 'DESC' = 'DESC';
}
