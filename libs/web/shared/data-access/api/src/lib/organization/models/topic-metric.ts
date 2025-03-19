import { Expose } from 'class-transformer';
import { Measurement, TransformMeasurement } from '@tellme/web/shared/utils/class-transformer';

export class TopicMetric {
  @Expose()
  public name: string;

  @Expose({ name: 'avg_sentiment' })
  @TransformMeasurement()
  public averageSentiment: Measurement;

  @Expose({ name: 'avg_duration' })
  @TransformMeasurement()
  public averageDuration: Measurement;

  @Expose()
  @TransformMeasurement()
  public count: Measurement;

  constructor(model: Partial<TopicMetric>) {
    Object.assign(this, model);
  }
}
