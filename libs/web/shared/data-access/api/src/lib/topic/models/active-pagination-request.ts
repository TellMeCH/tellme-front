import { Expose } from 'class-transformer';
import { PaginationRequest } from '../../common';

export class ActivePaginationRequest extends PaginationRequest {
  @Expose({ name: 'is_active' })
  public isActive?: boolean;

  constructor(model: Partial<ActivePaginationRequest>) {
    super(model);
    Object.assign(this, model);
  }
}
