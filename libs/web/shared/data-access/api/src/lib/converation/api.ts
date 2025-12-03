import { createEntityInstance } from '@ronas-it/rtkq-entity-api';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationResponse } from '../common';
import { createSearchResponseTransformer } from '../common/utils';
import { customerApiConfig } from '../customer';
import { conversationApiConfig } from './config';
import { Conversation, DetailedConversation } from './models';

export const conversationApi = createAppApi({
  reducerPath: conversationApiConfig.entityName,
  tagTypes: [conversationApiConfig.entityName],
  endpoints: (builder) => ({
    get: builder.query<DetailedConversation, { id: number }>({
      query: ({ id }) => ({
        method: 'get',
        url: `${conversationApiConfig.baseEndpoint}${id}/`,
      }),
      transformResponse: (response: object) =>
        createEntityInstance<DetailedConversation>(DetailedConversation, response),
      providesTags: ((response?: DetailedConversation) => ({
        type: conversationApiConfig.entityName,
        id: response?.idFromUrl,
      })) as any,
    }),
    searchByCustomer: builder.query<PaginationResponse<Conversation>, number>({
      query: (customerId) => ({
        method: 'get',
        url: `${customerApiConfig.baseEndpoint}${customerId}/conversations`,
      }),
      transformResponse: createSearchResponseTransformer<Conversation>(Conversation),
    }),
  }),
});
