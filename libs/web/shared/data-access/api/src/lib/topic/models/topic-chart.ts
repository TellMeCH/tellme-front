import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Expose } from 'class-transformer';
import { DateTime } from 'luxon';

export class TopicChartEntry {
  @Expose({ name: 'avg_sentiment' })
  public averageSentiment: number | null;

  @Expose({ name: 'avg_duration' })
  public averageDuration: number | null;

  @Expose()
  public count: number | null;

  @Expose()
  @TransformDate()
  public date: DateTime;

  constructor(model: Partial<TopicChartEntry>) {
    Object.assign(this, model);
  }
}
