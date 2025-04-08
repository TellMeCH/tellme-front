import { Expose } from 'class-transformer';
import { PaginationRequest } from '../../common';
import { TopicInfiniteListType } from '../enums';

export class TopicPaginationRequest extends PaginationRequest {
  @Expose({ name: 'list_type' })
  public listType?: TopicInfiniteListType;

  constructor(model: Partial<TopicPaginationRequest>) {
    super(model);
    Object.assign(this, model);
  }
}
