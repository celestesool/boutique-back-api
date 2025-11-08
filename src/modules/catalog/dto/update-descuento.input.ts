import { InputType, PartialType } from '@nestjs/graphql';
import { CreateDescuentoInput } from './create-descuento.input';

@InputType()
export class UpdateDescuentoInput extends PartialType(CreateDescuentoInput) {}
