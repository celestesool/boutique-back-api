import { InputType, Field } from '@nestjs/graphql';
import { IsArray, ValidateNested, ArrayMinSize, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateOrderItemInput } from './create-order-item.input';

@InputType()
export class CreateOrderInput {
  @Field(() => [CreateOrderItemInput])
  @IsNotEmpty({ message: 'Los items son requeridos' })
  @IsArray({ message: 'Los items deben ser un array' })
  @ArrayMinSize(1, { message: 'Debe incluir al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemInput)
  items: CreateOrderItemInput[];
}
