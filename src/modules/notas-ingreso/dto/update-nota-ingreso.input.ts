import { InputType, Field } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateEstadoNotaIngresoInput {
  @Field()
  @IsNotEmpty({ message: 'El estado es requerido' })
  @IsEnum(['pendiente', 'procesada', 'cancelada'], {
    message: 'El estado debe ser: pendiente, procesada o cancelada',
  })
  estado: string;
}
