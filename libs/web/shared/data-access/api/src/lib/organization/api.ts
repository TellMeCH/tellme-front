import { prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest } from '../common';
import { organizationApiConfig } from './config';
import { Overview } from './models';

export const organizationApi = createAppApi({
  reducerPath: organizationApiConfig.entityName,
  endpoints: (builder) => ({
    getOverviewData: builder.query<Array<Overview>, Record<string, never> | void>({
      query: () => ({
        method: 'get',
        url: `${organizationApiConfig.baseEndpoint}overview/`,
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

        return plainToInstance(Overview, overviewData);
      },
    }),
    getOrganization: builder.query<any, any>({
      query: ({ id }) => ({
        method: 'get',
        url: organizationApiConfig.baseEndpoint + id + '/',
        //params: prepareRequestParams(params, PaginationRequest),
      }),
      serializeQueryArgs: ({ queryArgs }) => prepareRequestParams(queryArgs, PaginationRequest),
      // transformResponse: (response) => {
      //   const { results, next, previous } = plainToInstance(PaginationResponse<any>, response as object);

      //   return {
      //     next,
      //     previous,
      //     results: results.map((result) => createEntityInstance<any>(Topic, result)),
      //   } as PaginationResponse<Topic>;
      // },
    }),
  }),
});
