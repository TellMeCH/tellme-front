import { Expose } from 'class-transformer';
import { CustomerSummaryStatus } from '../enums';
import { CustomerSummary } from './summary';

export class CustomerSummaryResponse {
  @Expose()
  public summary: CustomerSummary;

  @Expose()
  public status: CustomerSummaryStatus;

  constructor(model: Partial<CustomerSummaryResponse>) {
    Object.assign(this, model);
  }
}
