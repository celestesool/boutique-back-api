import { InputType, PartialType } from '@nestjs/graphql';
import { CreateMarcaInput } from './create-marca.input';

@InputType()
export class UpdateMarcaInput extends PartialType(CreateMarcaInput) {}
