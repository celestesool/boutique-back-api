import { InputType, Field, Float, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, IsUUID, IsOptional, IsString, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class DetalleNotaVentaInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  productoId: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;

  @Field(() => Float)
  @IsNotEmpty({ message: 'El precio unitario es requerido' })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @Min(0, { message: 'El precio unitario no puede ser negativo' })
  precioUnitario: number;
}

@InputType()
export class CreateNotaVentaInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'El ID de la orden debe ser un UUID válido' })
  ordenId?: string;

  @Field(() => [DetalleNotaVentaInput])
  @IsArray({ message: 'Los detalles deben ser un arreglo' })
  @ValidateNested({ each: true })
  @Type(() => DetalleNotaVentaInput)
  detalles: DetalleNotaVentaInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser texto' })
  observaciones?: string;
}
