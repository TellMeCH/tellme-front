import { createEntityInstance, EntityTagID, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { merge, omit } from 'lodash';
import { apiConfig, createAppApi } from '@tellme/web/shared/data-access/api-client';
import { ErrorResponse, PaginationRequest, PaginationResponse } from '../common';
import {
  createListTagsProvider,
  createMutationQueryWithData,
  createSearchResponseTransformer,
  mergeInInfiniteSearch,
} from '../common/utils';
import { conversationApi, conversationApiConfig } from '../converation';
import { topicApiConfig } from './config';
import { TopicListType } from './enums';
import {
  ModifiedTopic,
  Topic,
  TopicChartDataRequest,
  TopicChartEntry,
  TopicErrorData,
  TopicPaginationRequest,
  TopicSummary,
} from './models';

const getSearchQuery = ({
  listType = TopicListType.DEFAULT,
  params,
}: {
  listType?: TopicListType;
  params: PaginationRequest;
}) => {
  const searchQueryPath = {
    [TopicListType.DEFAULT]: '',
    [TopicListType.ACTIVE]: 'list_active/',
    [TopicListType.RECENT]: 'list_recent/',
  }[listType];

  return {
    method: 'get',
    url: `${topicApiConfig.baseEndpoint}${searchQueryPath}`,
    params: prepareRequestParams(params, PaginationRequest),
  };
};

const getListTags = createListTagsProvider<Topic>(topicApiConfig.entityName);

const transformSearchResponse = createSearchResponseTransformer<Topic>(Topic);

const transformTopicErrorResponse = (response: object): ErrorResponse<TopicErrorData> => {
  const { code, data } = plainToInstance(ErrorResponse<TopicErrorData>, response);

  return new ErrorResponse<TopicErrorData>({
    code,
    data: createEntityInstance(TopicErrorData, data),
  });
};

export const topicApi = createAppApi({
  reducerPath: topicApiConfig.entityName,
  tagTypes: [topicApiConfig.entityName],
  endpoints: (builder) => ({
    search: builder.query<PaginationResponse<Topic>, PaginationRequest>({
      query: (params) => getSearchQuery({ params }),
      serializeQueryArgs: ({ queryArgs }) => prepareRequestParams(queryArgs, PaginationRequest),
      transformResponse: transformSearchResponse,
      providesTags: getListTags,
    }),
    searchInfinite: builder.query<PaginationResponse<Topic>, TopicPaginationRequest>({
      query: ({ listType, ...params }) => getSearchQuery({ params, listType }),
      serializeQueryArgs: ({ queryArgs }) =>
        prepareRequestParams(omit(queryArgs, ['cursor']) as TopicPaginationRequest, TopicPaginationRequest),
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      transformResponse: transformSearchResponse,
      providesTags: getListTags,
      merge: mergeInInfiniteSearch,
    }),
    get: builder.query<Topic, { id: number }>({
      query: ({ id }) => {
        return {
          method: 'get',
          url: `${topicApiConfig.baseEndpoint}${id}/`,
        };
      },
      transformResponse: (response: object) => createEntityInstance<Topic>(Topic, response),
      providesTags: ((response?: Topic) => ({ type: topicApiConfig.entityName, id: response?.idFromUrl })) as any,
    }),
    getSummary: builder.query<TopicSummary, { id: number }>({
      query: ({ id }) => {
        return {
          method: 'get',
          url: `${topicApiConfig.baseEndpoint}${id}/summary_data/`,
        };
      },
      transformResponse: (response) => {
        return plainToInstance(TopicSummary, response as object);
      },
    }),
    getAllSummaries: builder.query<Array<TopicSummary>, void>({
      query: () => {
        return {
          method: 'get',
          url: `${topicApiConfig.baseEndpoint}all_summaries/`,
        };
      },
      transformResponse: (response) => {
        const summaries = Object.entries(response).map(([id, rawSummary]) => ({
          id: Number(id),
          ...(rawSummary as object),
        }));

        return plainToInstance(TopicSummary, summaries);
      },
    }),
    getChartData: builder.query<Array<TopicChartEntry>, { id: number; params: TopicChartDataRequest }>({
      query: ({ id, params }) => {
        return {
          method: 'get',
          url: `${topicApiConfig.baseEndpoint}${id}/trend/`,
          params: prepareRequestParams(params, TopicChartDataRequest),
        };
      },
      transformResponse: (response) => {
        return plainToInstance(TopicChartEntry, response.results as Array<object>);
      },
    }),
    create: builder.mutation<ModifiedTopic, Partial<ModifiedTopic>>({
      query: createMutationQueryWithData<ModifiedTopic>('post', () => topicApiConfig.baseEndpoint, ModifiedTopic),
      transformResponse: (response: object) => createEntityInstance<ModifiedTopic>(ModifiedTopic, response),
      transformErrorResponse: transformTopicErrorResponse,
      async onQueryStarted(_, { queryFulfilled, getState, dispatch }) {
        try {
          const result = (await queryFulfilled).data;
          const cachedQueries = topicApi.util.selectInvalidatedBy(getState(), [
            { type: topicApiConfig.entityName, id: EntityTagID.LIST },
          ]);

          const newTopic = new Topic({
            ...omit(result, 'id'),
            url: `${apiConfig.root}${topicApiConfig.baseEndpoint}${result.id}/`,
            updated: result.created,
          });

          for (const { endpointName, originalArgs } of cachedQueries) {
            if (originalArgs?.listType === TopicListType.RECENT) {
              continue;
            }

            dispatch(
              topicApi.util.updateQueryData(
                endpointName as 'search' | 'searchInfinite',
                originalArgs as any,
                (endpointData) => {
                  endpointData.results.push(newTopic);
                  endpointData.results.sort((a, b) => {
                    if (a.isActive !== b.isActive) {
                      return a.isActive ? -1 : 1;
                    }

                    return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
                  });
                },
              ),
            );
          }
          /* eslint-disable no-empty */
        } catch (error) {} //TODO: fix throwing errors here
        /* eslint-enable no-empty */
      },
    }),
    update: builder.mutation<Partial<ModifiedTopic>, Partial<ModifiedTopic>>({
      query: createMutationQueryWithData<ModifiedTopic>(
        'patch',
        (params) => `${topicApiConfig.baseEndpoint}${params.id}/`,
        ModifiedTopic,
      ),
      async onQueryStarted(arg, { queryFulfilled, getState, dispatch }) {
        try {
          const updatedEntityData = (await queryFulfilled).data;
          dispatch(conversationApi.util.invalidateTags([{ type: conversationApiConfig.entityName }]));

          const cachedQueries = topicApi.util.selectInvalidatedBy(getState(), [
            { type: topicApiConfig.entityName, id: arg.id },
            { type: topicApiConfig.entityName, id: EntityTagID.LIST },
          ]);

          const newTopic = new Topic({
            ...omit(updatedEntityData, 'id'),
            url: `${apiConfig.root}${topicApiConfig.baseEndpoint}${arg.id}/`,
          });

          for (const { endpointName, originalArgs } of cachedQueries) {
            dispatch(
              topicApi.util.updateQueryData(
                endpointName as 'search' | 'searchInfinite' | 'get',
                originalArgs as any,
                (endpointData) => {
                  if ('results' in endpointData && Array.isArray(endpointData.results)) {
                    const existingIndex = endpointData.results.findIndex((item) => item.idFromUrl === arg.id);

                    if (existingIndex !== -1) {
                      const existingItem = endpointData.results[existingIndex];
                      const oldIsActive = existingItem.isActive;

                      merge(existingItem, omit(updatedEntityData, 'id'));
                      const newIsActive = existingItem.isActive;

                      if (originalArgs?.listType === TopicListType.ACTIVE && oldIsActive && !newIsActive) {
                        endpointData.results.splice(existingIndex, 1);
                      }
                    } else if (originalArgs?.listType === TopicListType.ACTIVE && updatedEntityData.isActive) {
                      endpointData.results.push(newTopic);
                    }

                    if (originalArgs?.listType === TopicListType.ACTIVE) {
                      endpointData.results.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
                    }
                  } else {
                    merge(endpointData as Topic, omit(updatedEntityData, 'id'));
                  }
                },
              ),
            );
          }
          /* eslint-disable no-empty */
        } catch (error) {} //TODO: fix throwing errors here
        /* eslint-enable no-empty */
      },
      transformResponse: (response) => createEntityInstance<Topic>(Topic, response),
      transformErrorResponse: transformTopicErrorResponse,
    }),
    delete: builder.mutation<void, number>({
      query: (id) => ({
        method: 'delete',
        url: `${topicApiConfig.baseEndpoint}${id}/`,
      }),
      async onQueryStarted(id, { queryFulfilled, getState, dispatch }) {
        await queryFulfilled;

        dispatch(conversationApi.util.invalidateTags([{ type: conversationApiConfig.entityName }]));

        const cachedQueries = topicApi.util.selectInvalidatedBy(getState(), [
          { type: topicApiConfig.entityName, id: EntityTagID.LIST },
        ]);

        for (const { endpointName, originalArgs } of cachedQueries) {
          dispatch(
            topicApi.util.updateQueryData(
              endpointName as 'search' | 'searchInfinite',
              originalArgs as any,
              (endpointData) => {
                const existingItemIndex = endpointData.results.findIndex((item) => item.idFromUrl === id);

                if (existingItemIndex !== -1) {
                  endpointData.results.splice(existingItemIndex, 1);
                }
              },
            ),
          );
        }
      },
    }),
  }),
});
