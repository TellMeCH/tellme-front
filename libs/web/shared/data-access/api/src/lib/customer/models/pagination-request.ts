import { Expose } from 'class-transformer';
import { PaginationRequest } from '../../common';
import { CustomerOrdering } from '../types';

export class CustomerPaginationRequest extends PaginationRequest {
  @Expose()
  public ordering?: CustomerOrdering;

  constructor(model: Partial<CustomerPaginationRequest>) {
    super(model);
    Object.assign(this, model);
  }
}
