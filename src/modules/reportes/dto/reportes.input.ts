import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsDateString, IsNumber, Min } from 'class-validator';

@InputType()
export class ReporteFechasInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Fecha de inicio debe ser una fecha válida' })
  fechaInicio?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString({}, { message: 'Fecha de fin debe ser una fecha válida' })
  fechaFin?: string;
}

@InputType()
export class TopProductosInput {
  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsNumber({}, { message: 'El límite debe ser un número' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  limite?: number;
}
