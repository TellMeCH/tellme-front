import { Expose } from 'class-transformer';
import { TransformMeasurement, Measurement } from '@tellme/web/shared/utils/class-transformer';

export class General {
  @Expose({ name: 'avg_sentiment' })
  @TransformMeasurement()
  public averageSentiment: Measurement;

  @Expose({ name: 'avg_duration' })
  @TransformMeasurement()
  public averageDuration: Measurement;

  @Expose()
  @TransformMeasurement()
  public count: Measurement;

  @Expose({ name: 'most_popular_topic' })
  @TransformMeasurement()
  public mostPopularTopic: Measurement;

  constructor(model: Partial<General>) {
    Object.assign(this, model);
  }
}
