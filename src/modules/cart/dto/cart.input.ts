import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsNumber, Min, IsOptional, IsString } from 'class-validator';

@InputType()
export class AddToCartInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID('4', { message: 'El ID del usuario debe ser un UUID válido' })
  usuarioId: string;

  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  productoId: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;
}

@InputType()
export class UpdateCartItemInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID del item es requerido' })
  @IsUUID('4', { message: 'El ID del item debe ser un UUID válido' })
  itemId: string;

  @Field(() => Int)
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;
}

@InputType()
export class ApplyDiscountInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID del carrito es requerido' })
  @IsUUID('4', { message: 'El ID del carrito debe ser un UUID válido' })
  carritoId: string;

  @Field()
  @IsNotEmpty({ message: 'El código de descuento es requerido' })
  @IsString({ message: 'El código de descuento debe ser texto' })
  codigoDescuento: string;
}

@InputType()
export class RemoveFromCartInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID del item es requerido' })
  @IsUUID('4', { message: 'El ID del item debe ser un UUID válido' })
  itemId: string;
}
