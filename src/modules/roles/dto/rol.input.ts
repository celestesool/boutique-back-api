import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

@InputType()
export class CreateRolInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  @IsString()
  nombre: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permisosIds?: string[];
}

@InputType()
export class UpdateRolInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  permisosIds?: string[];
}
