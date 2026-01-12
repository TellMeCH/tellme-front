import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Exclude, Expose } from 'class-transformer';
import { DateTime } from 'luxon';
import { CustomerTicketStatus } from '../enums';

export class CustomerTicket {
  @Expose()
  public link: string | null;

  @Expose()
  @TransformDate()
  public date: DateTime | null;

  @Expose()
  public status: CustomerTicketStatus;

  @Exclude()
  public get isReady(): boolean {
    return this.status === CustomerTicketStatus.READY;
  }

  @Exclude()
  public get isCreating(): boolean {
    return this.status === CustomerTicketStatus.CREATING;
  }

  constructor(model: Partial<CustomerTicket>) {
    Object.assign(this, model);
  }
}
