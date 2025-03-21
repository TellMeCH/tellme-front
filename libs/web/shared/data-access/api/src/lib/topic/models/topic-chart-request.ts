import { Expose } from 'class-transformer';
import { ModifiedBaseEntity } from '../../common';
import { TrendPeriod } from '../enums/trend-period';

export class TopicChartRequest extends ModifiedBaseEntity {
  @Expose({ name: 'trend_period' })
  public trendPeriod?: TrendPeriod;

  constructor(model: Partial<TopicChartRequest>) {
    super(model);
    Object.assign(this, model);
  }
}
