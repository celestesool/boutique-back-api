import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderStatus } from '../entities/order.entity';

@InputType()
export class UpdateOrderInput {
  @Field(() => String, { nullable: true })
  @IsEnum(OrderStatus, { message: 'Estado inválido. Use: pendiente, pagado, enviado, entregado, cancelado' })
  @IsOptional()
  estado?: OrderStatus;

  @Field({ nullable: true })
  @IsString({ message: 'El número de seguimiento debe ser texto' })
  @MaxLength(100, { message: 'El número de seguimiento no puede exceder 100 caracteres' })
  @IsOptional()
  numeroSeguimiento?: string;
}
