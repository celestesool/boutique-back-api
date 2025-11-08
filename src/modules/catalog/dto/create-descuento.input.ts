import { InputType, Field, Float } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, IsNumber, Min, Max, IsDateString, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateDescuentoInput {
  @Field()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre: string;

  @Field(() => Float)
  @IsNumber({}, { message: 'El porcentaje debe ser un número' })
  @Min(0.01, { message: 'El porcentaje debe ser mayor a 0' })
  @Max(100, { message: 'El porcentaje no puede exceder 100' })
  porcentaje: number;

  @Field()
  @IsDateString({}, { message: 'La fecha de inicio debe tener formato válido (YYYY-MM-DD)' })
  fechaInicio: Date;

  @Field()
  @IsDateString({}, { message: 'La fecha de fin debe tener formato válido (YYYY-MM-DD)' })
  fechaFin: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser verdadero o falso' })
  activo?: boolean;
}
