import { DateTime } from 'luxon';

export const statisticsMock = {
  firstDate: DateTime.fromISO('2024-01-01T00:00:00Z'),
  secondDate: DateTime.fromISO('2024-02-01T00:00:00Z'),
  organisationName: 'Acme Org',
  averageSentiment: {
    firstMeasurement: 0.5,
    secondMeasurement: 0.6,
    change: -20.0,
  },
  averageDuration: {
    firstMeasurement: 35.3,
    secondMeasurement: 42.0,
    change: 19.07,
  },
  count: {
    firstMeasurement: 10,
    secondMeasurement: 12,
    change: 20.0,
  },
  mostPopularTopic: {
    firstMeasurement: 'Billing Issues',
    secondMeasurement: 'Technical Problems',
  },
};
