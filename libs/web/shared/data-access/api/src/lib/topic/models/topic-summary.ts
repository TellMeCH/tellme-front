import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Expose } from 'class-transformer';
import { DateTime } from 'luxon';
import { TransformSummary } from '@tellme/web/shared/utils/class-transformer';
import { SummaryDetail } from './summary-detail';

export class TopicSummary {
  @Expose({ name: 'id' })
  public topicId?: number;

  @Expose({ name: 'name' })
  public topicName?: string;

  @Expose({ name: 'summary_date' })
  @TransformDate()
  public summaryDate: DateTime;

  @Expose({ name: 'summary_call_count' })
  public summaryCallCount: number;

  @Expose()
  @TransformSummary()
  public summary: Array<SummaryDetail>;

  constructor(model: Partial<TopicSummary>) {
    Object.assign(this, model);
  }
}
