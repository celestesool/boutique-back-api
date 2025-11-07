import { InputType, Field, ID } from '@nestjs/graphql';
import { IsUUID, IsNumber, Min, IsNotEmpty } from 'class-validator';

@InputType()
export class CreateOrderItemInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsUUID('4', { message: 'Debe ser un UUID válido' })
  productId: string;

  @Field()
  @IsNotEmpty({ message: 'La cantidad es requerida' })
  @IsNumber({}, { message: 'La cantidad debe ser un número' })
  @Min(1, { message: 'La cantidad debe ser al menos 1' })
  cantidad: number;
}
