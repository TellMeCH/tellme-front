import { Expose, Type } from 'class-transformer';
import { CustomerSummaryStatus } from '../enums';
import { CustomerSummary } from './summary';

export class CustomerSummaryResponse {
  @Expose()
  @Type(() => CustomerSummary)
  public summary: CustomerSummary;

  @Expose()
  public status: CustomerSummaryStatus;

  constructor(model: Partial<CustomerSummaryResponse>) {
    Object.assign(this, model);
  }
}
