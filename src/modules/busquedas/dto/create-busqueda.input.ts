import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateBusquedaInput {
  @Field(() => ID)
  @IsNotEmpty({ message: 'El ID del producto es requerido' })
  @IsUUID('4', { message: 'El ID del producto debe ser un UUID válido' })
  productoId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  resultado?: string; // 'exitoso', 'fallido', 'visto'
}
