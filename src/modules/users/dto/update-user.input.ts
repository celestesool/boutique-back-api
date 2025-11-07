import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export enum UserRole {
  CLIENTE = 'cliente',
  ADMIN = 'admin',
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El nombre debe ser texto' })
  @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
  @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
  nombre?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsEmail({}, { message: 'Debe ser un email válido' })
  email?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  @MaxLength(50, { message: 'La contraseña no puede exceder 50 caracteres' })
  password?: string;
}

@InputType()
export class UpdateUserRoleInput {
  @Field(() => String)
  @IsEnum(UserRole, { message: 'El rol debe ser "cliente" o "admin"' })
  rol: UserRole;
}
