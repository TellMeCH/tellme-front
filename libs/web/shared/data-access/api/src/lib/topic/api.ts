import { createEntityInstance, EntityTagID, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { merge, omit } from 'lodash';
import { apiConfig, createAppApi } from '@tellme/web/shared/data-access/api-client';
import { ErrorResponse, PaginationRequest, PaginationResponse } from '../common';
import { topicApiConfig } from './config';
import {
  Topic,
  TopicPaginationRequest,
  ModifiedTopic,
  TopicChartRequest,
  TopicChart,
  TopicErrorData,
  TopicSummary,
} from './models';

const getSearchQuery = ({ isActive, ...params }: TopicPaginationRequest) => ({
  method: 'get',
  url: `${topicApiConfig.baseEndpoint}${isActive ? 'list_active/' : ''}`,
  params: prepareRequestParams(params, PaginationRequest),
});

const getListTags = (response?: PaginationResponse<Topic>) => [
  { type: topicApiConfig.entityName, id: EntityTagID.LIST },
  ...(response?.results.map((result) => ({ type: topicApiConfig.entityName, id: result.id })) || []),
];

const transformSearchResponse = (response: PaginationResponse<Topic>) => {
  const { results, next, previous } = plainToInstance(PaginationResponse<Topic>, response as object);

  return new PaginationResponse<Topic>({
    next,
    previous,
    results: results.map((result) => createEntityInstance<Topic>(Topic, result)),
  });
};

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
      query: getSearchQuery,
      serializeQueryArgs: ({ queryArgs }) => prepareRequestParams(queryArgs, PaginationRequest),
      transformResponse: transformSearchResponse,
      providesTags: getListTags,
    }),
    searchInfinite: builder.query<PaginationResponse<Topic>, TopicPaginationRequest>({
      query: getSearchQuery,
      serializeQueryArgs: ({ queryArgs }) =>
        prepareRequestParams(omit(queryArgs, ['cursor']) as TopicPaginationRequest, TopicPaginationRequest),
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      transformResponse: transformSearchResponse,
      providesTags: getListTags,
      merge: (cache, response, { arg }) => {
        if (!arg.cursor) {
          cache.results = response.results;
          cache.next = response.next;
          cache.previous = response.previous;
        } else {
          const fetchedItemsIDs = response.results.map((item) => item.id);
          cache.results = cache.results.filter((item) => !fetchedItemsIDs.includes(item.id));

          if (arg.cursor === cache.nextCursor) {
            cache.results.push(...response.results);
            cache.next = response.next;
          }

          if (arg.cursor === cache.previousCursor) {
            cache.results.unshift(...response.results);
            cache.previous = response.previous;
          }
        }
      },
    }),
    get: builder.query<Topic, { id: number }>({
      query: ({ id }) => {
        return {
          method: 'get',
          url: `${topicApiConfig.baseEndpoint}${id}/`,
        };
      },
      transformResponse: (response: object) => createEntityInstance<Topic>(Topic, response),
      providesTags: ((response?: Topic) => ({ type: topicApiConfig.entityName, id: response?.id })) as any,
    }),
    getSummaryData: builder.query<TopicSummary, { id: number }>({
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
    getChartData: builder.query<Array<TopicChart>, TopicChartRequest>({
      query: ({ id, ...params }) => {
        return {
          method: 'get',
          url: `${topicApiConfig.baseEndpoint}${id}/trend/`,
          params: prepareRequestParams(params, TopicChartRequest),
        };
      },
      transformResponse: (response) => {
        return plainToInstance(TopicChart, response.results as Array<object>);
      },
    }),
    create: builder.mutation<ModifiedTopic, Partial<ModifiedTopic>>({
      query: (params) => {
        const request = createEntityInstance(ModifiedTopic, params, { fromInstancePartial: true });

        return {
          method: 'post',
          url: topicApiConfig.baseEndpoint,
          data: instanceToPlain(request),
        };
      },
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
      query: (params) => {
        const updatedEntity = createEntityInstance(ModifiedTopic, params, {
          fromInstancePartial: true,
        });
        const request = instanceToPlain(updatedEntity);

        return {
          method: 'patch',
          url: `${topicApiConfig.baseEndpoint}${request.id}/`,
          data: request,
        };
      },
      async onQueryStarted(arg, { queryFulfilled, getState, dispatch }) {
        try {
          const updatedEntityData = (await queryFulfilled).data;

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
                    const existingIndex = endpointData.results.findIndex((item) => item.id === arg.id);

                    if (existingIndex !== -1) {
                      const existingItem = endpointData.results[existingIndex];
                      const oldIsActive = existingItem.isActive;

                      merge(existingItem, omit(updatedEntityData, 'id'));
                      const newIsActive = existingItem.isActive;

                      if (originalArgs?.isActive && oldIsActive && !newIsActive) {
                        endpointData.results.splice(existingIndex, 1);
                      }
                    } else if (originalArgs?.isActive && updatedEntityData.isActive) {
                      endpointData.results.push(newTopic);
                    }

                    if (originalArgs?.isActive) {
                      endpointData.results.sort((a, b) => a.name.localeCompare(b.name));
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

        const cachedQueries = topicApi.util.selectInvalidatedBy(getState(), [
          { type: topicApiConfig.entityName, id: EntityTagID.LIST },
        ]);

        for (const { endpointName, originalArgs } of cachedQueries) {
          dispatch(
            topicApi.util.updateQueryData(
              endpointName as 'search' | 'searchInfinite',
              originalArgs as any,
              (endpointData) => {
                const existingItemIndex = endpointData.results.findIndex((item) => item.id === id);

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
