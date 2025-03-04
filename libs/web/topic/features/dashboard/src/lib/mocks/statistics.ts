import { DateTime } from 'luxon';

export const statisticsMock = {
  general: {
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
  },
  topics: [
    {
      name: 'Topic 1',
      description:
        'Customers frequently contact the call center to inquire about restock dates and availability of specific clothing items.',
      averageSentiment: {
        firstMeasurement: 0.7,
        secondMeasurement: 0.65,
        change: -7.14,
      },
      averageDuration: {
        firstMeasurement: 38.0,
        secondMeasurement: 40.0,
        change: 5.26,
      },
      count: {
        firstMeasurement: 8,
        secondMeasurement: 9,
        change: 12.5,
      },
    },
    {
      name: 'Topic 4',
      description:
        'Customers frequently contact the call center to inquire about restock dates and availability of specific clothing items.',
      averageSentiment: {
        firstMeasurement: 0.5,
        secondMeasurement: 0.55,
        change: 10.0,
      },
      averageDuration: {
        firstMeasurement: 45.1,
        secondMeasurement: 45.1,
        change: 0,
      },
      count: {
        firstMeasurement: 10,
        secondMeasurement: 10,
        change: 0,
      },
    },
  ],
};
