import { Expose, Type } from 'class-transformer';
import { Overview } from './overview';
import { TopicMetric } from './topic-metric';

export class TopicsOverview extends Overview {
  @Expose()
  @Type(() => TopicMetric)
  public topicMetrics: Array<TopicMetric>;

  constructor(model: Partial<TopicsOverview>) {
    super(model);
    Object.assign(this, model);
  }
}
