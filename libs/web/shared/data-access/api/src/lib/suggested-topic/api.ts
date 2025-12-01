import { createEntityInstance, EntityTagID, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { ErrorResponse, PaginationRequest, PaginationResponse } from '../common';
import { createListTagsProvider, createSearchResponseTransformer } from '../common/utils';
import { conversationApi, conversationApiConfig } from '../converation';
import { organizationApi, OrganizationTagType } from '../organization';
import { topicApi, topicApiConfig } from '../topic';
import { suggestedTopicApiConfig } from './config';
import { SuggestedTopic, SuggestedTopicErrorData } from './models';

const getListTags = createListTagsProvider<SuggestedTopic>(suggestedTopicApiConfig.entityName);

const transformSearchResponse = createSearchResponseTransformer<SuggestedTopic>(SuggestedTopic);

const transformSuggestedTopicErrorResponse = (response: object): ErrorResponse<SuggestedTopicErrorData> => {
  const { code, data } = plainToInstance(ErrorResponse<SuggestedTopicErrorData>, response);

  return new ErrorResponse<SuggestedTopicErrorData>({
    code,
    data: createEntityInstance(SuggestedTopicErrorData, data),
  });
};

export const suggestedTopicApi = createAppApi({
  reducerPath: suggestedTopicApiConfig.entityName,
  tagTypes: [suggestedTopicApiConfig.entityName],
  endpoints: (builder) => ({
    search: builder.query<PaginationResponse<SuggestedTopic>, PaginationRequest>({
      query: (params: PaginationRequest) => ({
        method: 'get',
        url: suggestedTopicApiConfig.baseEndpoint,
        params: prepareRequestParams(params, PaginationRequest),
      }),
      serializeQueryArgs: ({ queryArgs }) => prepareRequestParams(queryArgs, PaginationRequest),
      transformResponse: transformSearchResponse,
      providesTags: getListTags,
    }),
    accept: builder.mutation<void, number>({
      query: (id: number) => ({
        method: 'post',
        url: `${suggestedTopicApiConfig.baseEndpoint}${id}/accept/`,
      }),
      transformErrorResponse: transformSuggestedTopicErrorResponse,
      async onQueryStarted(id, { queryFulfilled, getState, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(topicApi.util.invalidateTags([{ type: topicApiConfig.entityName, id: EntityTagID.LIST }]));
          dispatch(organizationApi.util.invalidateTags([OrganizationTagType.OVERVIEW]));
          dispatch(conversationApi.util.invalidateTags([{ type: conversationApiConfig.entityName }]));

          const cachedQueries = suggestedTopicApi.util.selectInvalidatedBy(getState(), [
            { type: suggestedTopicApiConfig.entityName, id: EntityTagID.LIST },
          ]);

          for (const { endpointName, originalArgs } of cachedQueries) {
            dispatch(
              suggestedTopicApi.util.updateQueryData(endpointName as 'search', originalArgs as any, (endpointData) => {
                const existingItemIndex = endpointData.results.findIndex((item) => item.id === id);

                if (existingItemIndex !== -1) {
                  endpointData.results.splice(existingItemIndex, 1);
                }
              }),
            );
          }
          /* eslint-disable no-empty */
        } catch (error) {}
        /* eslint-enable no-empty */
      },
    }),
  }),
});
