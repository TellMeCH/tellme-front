import { Expose } from 'class-transformer';
import { TrendPeriod } from '../enums/trend-period';

export class TopicChartDataRequest {
  @Expose({ name: 'trend_period' })
  public trendPeriod?: TrendPeriod;

  constructor(model: Partial<TopicChartDataRequest>) {
    Object.assign(this, model);
  }
}
