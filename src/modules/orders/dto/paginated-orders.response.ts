import { ObjectType, Field } from '@nestjs/graphql';
import { Order } from '../entities/order.entity';
import { PaginationInfo } from '../../../common/dto/pagination-info.dto';

@ObjectType()
export class PaginatedOrdersResponse {
  @Field(() => [Order])
  items: Order[];

  @Field(() => PaginationInfo)
  pageInfo: PaginationInfo;
}
