import { Expose, Transform } from 'class-transformer';
import { Measurement } from './measurement';

export class TopicMetric {
  @Expose()
  public name: string;

  @Expose({ name: 'avg_sentiment' })
  @Transform(({ value }) => Measurement.fromRaw(value))
  public averageSentiment: Measurement;

  @Expose({ name: 'avg_duration' })
  @Transform(({ value }) => Measurement.fromRaw(value))
  public averageDuration: Measurement;

  @Expose()
  @Transform(({ value }) => Measurement.fromRaw(value))
  public count: Measurement;

  constructor(model: Partial<TopicMetric>) {
    Object.assign(this, model);
  }
}
