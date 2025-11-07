import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString, IsEnum } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

// Registrar el enum para GraphQL
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Estados posibles de una orden',
});

@InputType()
export class OrderFiltersInput {
  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus, { message: 'Estado inválido' })
  estado?: OrderStatus;

  @Field({ nullable: true, defaultValue: 'createdAt' })
  @IsOptional()
  @IsString()
  ordenarPor?: string = 'createdAt';

  @Field({ nullable: true, defaultValue: 'DESC' })
  @IsOptional()
  @IsString()
  orden?: 'ASC' | 'DESC' = 'DESC';
}
