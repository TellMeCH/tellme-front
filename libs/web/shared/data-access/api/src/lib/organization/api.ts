import { prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { organizationApiConfig } from './config';
import { Overview, Organization } from './models';
import { OverviewRequest } from './models/overview-request';

export const organizationApi = createAppApi({
  reducerPath: organizationApiConfig.entityName,
  endpoints: (builder) => ({
    getOverviewData: builder.query<Overview, OverviewRequest>({
      query: (params) => ({
        method: 'get',
        url: `${organizationApiConfig.baseEndpoint}overview/`,
        params: prepareRequestParams(params, OverviewRequest),
      }),
      transformResponse: (response) => {
        const [idKey] = Object.keys(response);
        //const durationKeys = Object.keys(response[idKey].general.avg_duration).filter((key) => key !== 'change');
        //const [secondDate, firstDate] = durationKeys;

        const overviewData = {
          id: Number(idKey),
          //firstDate,
          //secondDate,
          ...response[idKey],
        };

        return plainToInstance(Overview, overviewData as object);
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
