import { Expose } from 'class-transformer';
import { PaginationRequest } from '../../common';

export class TopicPaginationRequest extends PaginationRequest {
  @Expose({ name: 'list_type' })
  public listType?: string;

  constructor(model: Partial<TopicPaginationRequest>) {
    super(model);
    Object.assign(this, model);
  }
}
