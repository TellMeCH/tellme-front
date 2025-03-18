import { prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { organizationApiConfig } from './config';
import { GeneralOverview, Organization, TopicsOverview } from './models';
import { OverviewRequest } from './models/overview-request';

export const organizationApi = createAppApi({
  reducerPath: organizationApiConfig.entityName,
  endpoints: (builder) => ({
    getGeneralOverview: builder.query<GeneralOverview, Record<string, never> | void>({
      query: () => ({
        method: 'get',
        url: `${organizationApiConfig.baseEndpoint}overview/`,
        params: prepareRequestParams({ perTopic: false }, OverviewRequest),
      }),
      transformResponse: (response) => {
        const [idKey] = Object.keys(response);
        const durationKeys = Object.keys(response[idKey].general.avg_duration).filter((key) => key !== 'change');
        const [secondDate, firstDate] = durationKeys;

        const overviewData = {
          id: Number(idKey),
          firstDate,
          secondDate,
          ...response[idKey],
        };

        return plainToInstance(GeneralOverview, overviewData as object);
      },
    }),
    getTopicsOverview: builder.query<TopicsOverview, Record<string, never> | void>({
      query: () => ({
        method: 'get',
        url: `${organizationApiConfig.baseEndpoint}overview/`,
        params: prepareRequestParams({ perTopic: true }, OverviewRequest),
      }),
      transformResponse: (response) => {
        const [idKey] = Object.keys(response);
        const topicsData = response[idKey];

        const firstTopicKey = Object.keys(topicsData)[0];
        const durationKeys = Object.keys(topicsData[firstTopicKey].avg_duration).filter((key) => key !== 'change');
        const [secondDate, firstDate] = durationKeys;

        const topics = Object.entries(topicsData).map(([topicName, topicMetrics]) => ({
          name: topicName,
          ...(topicMetrics as object),
        }));

        return plainToInstance(TopicsOverview, {
          id: Number(idKey),
          firstDate,
          secondDate,
          topics,
        });
      },
    }),
    getOrganization: builder.query<Organization, { id?: number }>({
      query: ({ id }) => ({
        method: 'get',
        url: `${organizationApiConfig.baseEndpoint}${id}/`,
      }),
      transformResponse: (response) => plainToInstance(Organization, response as object),
    }),
  }),
});
