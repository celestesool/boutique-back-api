import { ObjectType, Field } from '@nestjs/graphql';
import { Product } from '../entities/product.entity';
import { PaginationInfo } from '../../../common/dto/pagination-info.dto';

@ObjectType()
export class PaginatedProductsResponse {
  @Field(() => [Product])
  items: Product[];

  @Field(() => PaginationInfo)
  pageInfo: PaginationInfo;
}
