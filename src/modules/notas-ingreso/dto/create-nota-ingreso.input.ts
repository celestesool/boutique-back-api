import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@InputType()
export class CreateDetalleNotaIngresoInput {
  @Field()
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  productoId: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsInt({ message: 'La cantidad debe ser un número entero' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;

  @Field(() => Float)
  @IsNotEmpty({ message: 'El precio unitario es requerido' })
  @IsNumber({}, { message: 'El precio unitario debe ser un número' })
  @Min(0, { message: 'El precio unitario no puede ser negativo' })
  precio_unitario: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observacion?: string;
}

@InputType()
export class CreateNotaIngresoInput {
  @Field()
  @IsNotEmpty({ message: 'El proveedor es requerido' })
  @IsString()
  proveedor: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  observaciones?: string;

  @Field(() => [CreateDetalleNotaIngresoInput])
  @IsNotEmpty({ message: 'Los detalles son requeridos' })
  detalles: CreateDetalleNotaIngresoInput[];
}
