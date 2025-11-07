import { InputType, Field, Float } from '@nestjs/graphql';

@InputType()
export class CreateProductInput {
  @Field()
  nombre: string;

  @Field()
  descripcion: string;

  @Field(() => Float)
  precio: number;

  @Field()
  stock: number;

  @Field({ nullable: true })
  imagen_url?: string;
}
