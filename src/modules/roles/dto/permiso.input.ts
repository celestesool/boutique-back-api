import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

@InputType()
export class CreatePermisoInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre del permiso es requerido' })
  @IsString()
  nombre: string;

  @Field()
  @IsNotEmpty({ message: 'El código del permiso es requerido' })
  @IsString()
  codigo: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field({ defaultValue: 'general' })
  @IsOptional()
  @IsString()
  modulo?: string;
}

@InputType()
export class UpdatePermisoInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  modulo?: string;
}
