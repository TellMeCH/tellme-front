import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Exclude, Expose } from 'class-transformer';
import { DateTime } from 'luxon';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';
import { BaseEntity } from '../../common';

export class Customer extends BaseEntity {
  @Expose({ name: 'last_conversation_date' })
  @TransformDate()
  public lastConversationDate: DateTime;

  @Expose({ name: 'first_conversation_date' })
  @TransformDate()
  public firstConversationDate: DateTime;

  @Expose({ name: 'first_name' })
  public firstName: string;

  @Expose({ name: 'last_name' })
  public lastName: string;

  @Expose({ name: 'latest_conversation_title' })
  public latestConversationTitle: string;

  @Expose({ name: 'latest_conversation_url' })
  public latestConversationUrl: string;

  @Expose({ name: 'avg_sentiment' })
  public averageSentiment: number;

  @Expose({ name: 'total_revenue' })
  public totalRevenue: number;

  @Expose({ name: 'conversation_count' })
  public conversationsCount: number;

  @Expose({ name: 'ticket_link' })
  public ticketLink?: string;

  @Exclude()
  public get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Exclude()
  public get latestConversationId(): number {
    return getIdFromUrl(this.latestConversationUrl);
  }

  @Exclude()
  public get hasTicket(): boolean {
    return !!this.ticketLink;
  }

  constructor(model: Partial<Customer>) {
    super(model);
    Object.assign(this, model);
  }
}
