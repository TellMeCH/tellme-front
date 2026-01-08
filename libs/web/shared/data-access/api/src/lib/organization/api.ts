import { prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { organizationApiConfig } from './config';
import { OrganizationTagType } from './enums';
import { GeneralOverview, Organization, TopicsOverview } from './models';
import { OverviewRequest } from './models/overview-request';

export const organizationApi = createAppApi({
  reducerPath: organizationApiConfig.entityName,
  tagTypes: [OrganizationTagType.OVERVIEW],
  endpoints: (builder) => ({
    getGeneralOverview: builder.query<GeneralOverview, void>({
      query: () => ({
        method: 'get',
        url: `${organizationApiConfig.baseEndpoint}overview/`,
        params: prepareRequestParams({ perTopic: false }, OverviewRequest),
      }),
      transformResponse: (response: any) => {
        const [organisationId] = Object.keys(response);
        const durationKeys = Object.keys(response[organisationId].general.avg_duration)
          .filter((key) => key !== 'change')
          .sort();

        const [previousMonth, currentMonth] = durationKeys;

        const overviewData = {
          id: Number(organisationId),
          currentMonth,
          previousMonth,
          ...response[organisationId],
        };

        return plainToInstance(GeneralOverview, overviewData as object);
      },
      providesTags: [OrganizationTagType.OVERVIEW],
    }),
    getTopicsOverview: builder.query<TopicsOverview | null, void>({
      query: () => ({
        method: 'get',
        url: `${organizationApiConfig.baseEndpoint}overview/`,
        params: prepareRequestParams({ perTopic: true }, OverviewRequest),
      }),
      transformResponse: (response: any) => {
        const [organisationId] = Object.keys(response);
        const topicsData = response[organisationId];
        const hasAnyTopic = Object.keys(topicsData).length > 0;

        if (!hasAnyTopic) {
          return null;
        }

        const firstTopicKey = Object.keys(topicsData)[0];
        const durationKeys = Object.keys(topicsData[firstTopicKey].avg_duration)
          .filter((key) => key !== 'change')
          .sort();

        const [previousMonth, currentMonth] = durationKeys;

        const topicMetrics = Object.entries(topicsData).map(([topicName, topicMetrics]) => ({
          name: topicName,
          ...(topicMetrics as object),
        }));

        return plainToInstance(TopicsOverview, {
          id: Number(organisationId),
          currentMonth,
          previousMonth,
          topicMetrics,
        });
      },
      providesTags: [OrganizationTagType.OVERVIEW],
    }),
    getOrganization: builder.query<Organization, { id: number }>({
      query: ({ id }) => ({
        method: 'get',
        url: `${organizationApiConfig.baseEndpoint}${id}/`,
      }),
      transformResponse: (response) => plainToInstance(Organization, response as object),
    }),
  }),
});
