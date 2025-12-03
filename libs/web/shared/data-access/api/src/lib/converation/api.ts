import { createEntityInstance } from '@ronas-it/rtkq-entity-api';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { conversationApiConfig } from './config';
import { Conversation } from './models';

export const conversationApi = createAppApi({
  reducerPath: conversationApiConfig.entityName,
  endpoints: (builder) => ({
    get: builder.query<Conversation, { id: number }>({
      query: ({ id }) => ({
        method: 'get',
        url: `${conversationApiConfig.baseEndpoint}${id}/`,
      }),
      transformResponse: (response: object) => createEntityInstance<Conversation>(Conversation, response),
    }),
  }),
});
