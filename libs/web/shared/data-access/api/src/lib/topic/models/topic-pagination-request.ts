import { Expose } from 'class-transformer';
import { PaginationRequest } from '../../common';

export class TopicPaginationRequest extends PaginationRequest {
  @Expose({ name: 'is_active' })
  public isActive?: boolean;

  constructor(model: Partial<TopicPaginationRequest>) {
    super(model);
    Object.assign(this, model);
  }
}
