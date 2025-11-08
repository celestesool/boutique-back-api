import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateTallaInput {
  @Field()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(1, { message: 'El nombre debe tener al menos 1 carácter' })
  @MaxLength(10, { message: 'El nombre no puede exceder 10 caracteres' })
  nombre: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La medida debe ser un texto' })
  @MaxLength(20, { message: 'La medida no puede exceder 20 caracteres' })
  medida?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser verdadero o falso' })
  activo?: boolean;
}
