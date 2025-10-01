import { EntityTagID, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
import { createListTagsProvider, createSearchResponseTransformer } from '../common/utils';
import { organizationApi, OrganizationTagType } from '../organization';
import { topicApi } from '../topic';
import { suggestedTopicApiConfig } from './config';
import { SuggestedTopic } from './models';

const getListTags = createListTagsProvider<SuggestedTopic>(suggestedTopicApiConfig.entityName);

const transformSearchResponse = createSearchResponseTransformer<SuggestedTopic>(SuggestedTopic);

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
        url: `${suggestedTopicApiConfig.baseEndpoint}/${id}/accept/`,
      }),
      async onQueryStarted(id, { queryFulfilled, getState, dispatch }) {
        try {
          await queryFulfilled;
          dispatch(topicApi.util.invalidateTags([{ type: suggestedTopicApiConfig.entityName, id: EntityTagID.LIST }]));
          dispatch(organizationApi.util.invalidateTags([OrganizationTagType.OVERVIEW]));

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
