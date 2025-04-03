import { TrendPeriod } from '@tellme/web/shared/data-access/api';

interface TopicChartDataPoint {
  date: string;
  count: number;
  averageSentiment: number;
}

//NOTE: Need to move ChartState to interfaces because of circular dependency
export interface ChartState {
  data: Array<TopicChartDataPoint>;
  period: TrendPeriod;
}
