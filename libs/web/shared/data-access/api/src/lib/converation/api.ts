import { createEntityInstance, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
import { createInfiniteQueryOptions, createSearchResponseTransformer } from '../common/utils';
import { customerApiConfig } from '../customer';
import { conversationApiConfig } from './config';
import { Conversation, DetailedConversation } from './models';
import { TranscriptItem } from './models/transcript-item';

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
    searchTranscript: builder.infiniteQuery<
      PaginationResponse<TranscriptItem>,
      { conversationId: number; params: PaginationRequest },
      string | undefined
    >({
      infiniteQueryOptions: createInfiniteQueryOptions<TranscriptItem>(),
      query: ({ queryArg: { conversationId, params }, pageParam }) => ({
        method: 'get',
        url: `${conversationApiConfig.baseEndpoint}${conversationId}/transcript?`,
        params: prepareRequestParams({ ...params, cursor: pageParam }, PaginationRequest),
      }),
      transformResponse: createSearchResponseTransformer<TranscriptItem>(TranscriptItem),
    }),
  }),
});
