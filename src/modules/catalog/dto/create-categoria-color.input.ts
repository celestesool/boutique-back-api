import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsArray, IsUUID } from 'class-validator';

@InputType()
export class CreateCategoriaColorInput {
  @Field()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser un texto' })
  @MaxLength(500, { message: 'La descripción no puede exceder 500 caracteres' })
  descripcion?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Los colores deben ser un arreglo' })
  @IsUUID('4', { each: true, message: 'Cada color debe ser un UUID válido' })
  coloresIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser verdadero o falso' })
  activo?: boolean;
}
