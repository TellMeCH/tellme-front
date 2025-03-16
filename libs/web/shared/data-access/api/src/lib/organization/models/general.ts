import { Expose, Transform } from 'class-transformer';
import { Measurement } from './measurement';

export class General {
  @Expose({ name: 'avg_sentiment' })
  @Transform(({ value }) => Measurement.fromRaw(value))
  public averageSentiment: Measurement;

  @Expose({ name: 'avg_duration' })
  @Transform(({ value }) => Measurement.fromRaw(value))
  public averageDuration: Measurement;

  @Expose()
  @Transform(({ value }) => Measurement.fromRaw(value))
  public count: Measurement;

  @Expose({ name: 'most_popular_topic' })
  @Transform(({ value }) => Measurement.fromRaw(value))
  public mostPopularTopic: Measurement;

  constructor(model: Partial<General>) {
    Object.assign(this, model);
  }
}
