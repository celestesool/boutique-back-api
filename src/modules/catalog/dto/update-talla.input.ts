import { InputType, PartialType } from '@nestjs/graphql';
import { CreateTallaInput } from './create-talla.input';

@InputType()
export class UpdateTallaInput extends PartialType(CreateTallaInput) {}
