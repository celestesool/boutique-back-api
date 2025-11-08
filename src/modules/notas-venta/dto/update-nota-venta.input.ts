import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoNotaVenta } from '../entities/nota-venta.entity';

@InputType()
export class UpdateNotaVentaInput {
  @Field(() => EstadoNotaVenta, { nullable: true })
  @IsOptional()
  @IsEnum(EstadoNotaVenta, { message: 'Estado inválido' })
  estado?: EstadoNotaVenta;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Las observaciones deben ser texto' })
  observaciones?: string;
}
