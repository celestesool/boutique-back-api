import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, Matches, IsOptional, IsBoolean } from 'class-validator';

@InputType()
export class CreateColorInput {
  @Field()
  @IsString({ message: 'El nombre debe ser un texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre no puede exceder 50 caracteres' })
  nombre: string;

  @Field()
  @IsString({ message: 'El código hexadecimal debe ser un texto' })
  @Matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
    message: 'El código hexadecimal debe tener formato válido (ejemplo: #FF5733)',
  })
  codigoHex: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser verdadero o falso' })
  activo?: boolean;
}
