import { Interval } from 'luxon';
import { TopicChartEntry } from '@tellme/web/shared/data-access/api';

export const transformChartData = (rawChartData: Array<TopicChartEntry>, timeline: Array<Interval>) => {
  return timeline.map((interval) => {
    const items = rawChartData.filter((item) => interval.contains(item.date));

    const count = items.reduce((sum, i) => sum + Number(i.count), 0);
    const averageSentiment = items.length
      ? items.reduce((sum, i) => sum + Number(i.averageSentiment), 0) / items.length
      : 0;

    return {
      date: interval.start!.toISO(),
      count,
      averageSentiment,
    };
  });
};
