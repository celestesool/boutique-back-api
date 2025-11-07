import { InputType, Field, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Min, Max } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsInt({ message: 'La página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser al menos 1' })
  page?: number = 1;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite debe ser al menos 1' })
  @Max(100, { message: 'El límite no puede exceder 100' })
  limit?: number = 10;
}
