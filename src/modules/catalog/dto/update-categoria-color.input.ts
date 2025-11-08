import { InputType, PartialType } from '@nestjs/graphql';
import { CreateCategoriaColorInput } from './create-categoria-color.input';

@InputType()
export class UpdateCategoriaColorInput extends PartialType(CreateCategoriaColorInput) {}
