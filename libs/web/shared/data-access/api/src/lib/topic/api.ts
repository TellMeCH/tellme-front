import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { topicApiConfig } from './config';
import { Topic } from './models';

export const topicApi = createAppApi({
  reducerPath: topicApiConfig.entityName,
  endpoints: (builder) => ({
    get: builder.query<Topic, number>({
      query: (id) => {
        return {
          method: 'get',
          url: `${topicApiConfig.baseEndpoint}/${id}`,
        };
      },
      transformResponse: (response) => plainToInstance(Topic, response as object),
    }),
  }),
});
