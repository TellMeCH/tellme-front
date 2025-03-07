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
        firstMeasurement: 2,
        secondMeasurement: 3,
      },
      averageDuration: {
        firstMeasurement: 50,
        secondMeasurement: 60,
      },
    },
    {
      name: 'Topic 4',
      description:
        'Customers frequently contact the call center to inquire about restock dates and availability of specific clothing items.',
      averageSentiment: {
        firstMeasurement: 1,
        secondMeasurement: 5,
      },
      averageDuration: {
        firstMeasurement: 20,
        secondMeasurement: 80,
      },
    },
  ],
};
