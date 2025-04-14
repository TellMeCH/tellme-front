import { createEntityInstance, EntityTagID, prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { merge, omit } from 'lodash';
import { apiConfig, createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
import { createListTagsProvider, createSearchResponseTransformer, mergeInInfiniteSearch } from '../common/utils';
import { TopicPaginationRequest } from '../topic';
import { employeeApiConfig } from './config';
import { Employee, ModifiedEmployee } from './models';

export const employeeApi = createAppApi({
  reducerPath: employeeApiConfig.entityName,
  tagTypes: [employeeApiConfig.entityName],
  endpoints: (builder) => ({
    getProfile: builder.query<Employee, void>({
      query: () => ({
        method: 'get',
        url: `${employeeApiConfig.baseEndpoint}me/`,
      }),
      transformResponse: (response) => plainToInstance(Employee, response as object),
    }),
    searchInfinite: builder.query<PaginationResponse<Employee>, PaginationRequest>({
      query: (params: TopicPaginationRequest) => ({
        method: 'get',
        url: employeeApiConfig.baseEndpoint,
        params: prepareRequestParams(params, PaginationRequest),
      }),
      serializeQueryArgs: ({ queryArgs }) =>
        prepareRequestParams(omit(queryArgs, ['cursor']) as PaginationRequest, PaginationRequest),
      forceRefetch: ({ currentArg, previousArg }) => currentArg?.cursor !== previousArg?.cursor,
      transformResponse: createSearchResponseTransformer<Employee>(Employee),
      providesTags: createListTagsProvider<Employee>(employeeApiConfig.entityName),
      merge: mergeInInfiniteSearch,
    }),
    create: builder.mutation<ModifiedEmployee, Partial<ModifiedEmployee>>({
      query: (params) => {
        const request = createEntityInstance(ModifiedEmployee, params, { fromInstancePartial: true });

        return {
          method: 'post',
          url: employeeApiConfig.baseEndpoint,
          data: instanceToPlain(request),
        };
      },
      transformResponse: (response: object) => createEntityInstance<ModifiedEmployee>(ModifiedEmployee, response),
      async onQueryStarted(_, { queryFulfilled, getState, dispatch }) {
        try {
          const result = (await queryFulfilled).data;
          const cachedQueries = employeeApi.util.selectInvalidatedBy(getState(), [
            { type: employeeApiConfig.entityName, id: EntityTagID.LIST },
          ]);

          const newEmployee = new Employee({
            ...omit(result, 'id'),
            url: `${apiConfig.root}${employeeApiConfig.baseEndpoint}${result.id}/`,
            updated: result.created,
          });

          for (const { endpointName, originalArgs } of cachedQueries) {
            dispatch(
              employeeApi.util.updateQueryData(
                endpointName as 'searchInfinite',
                originalArgs as any,
                (endpointData) => {
                  endpointData.results.unshift(newEmployee);
                },
              ),
            );
          }
          /* eslint-disable no-empty */
        } catch (error) {}
        /* eslint-enable no-empty */
      },
    }),
    invite: builder.mutation<void, number>({
      query: (id: number) => ({
        method: 'post',
        url: `${employeeApiConfig.baseEndpoint}${id}/invite/`,
      }),
    }),
    update: builder.mutation<Partial<ModifiedEmployee>, Partial<ModifiedEmployee>>({
      query: (params) => {
        const updatedEntity = createEntityInstance(ModifiedEmployee, params, {
          fromInstancePartial: true,
        });
        const request = instanceToPlain(updatedEntity);

        return {
          method: 'patch',
          url: `${employeeApiConfig.baseEndpoint}${request.id}/`,
          data: request,
        };
      },
      transformResponse: (response) => createEntityInstance<Employee>(Employee, response),
      async onQueryStarted(arg, { queryFulfilled, getState, dispatch }) {
        try {
          const updatedEntityData = (await queryFulfilled).data;

          const cachedQueries = employeeApi.util.selectInvalidatedBy(getState(), [
            { type: employeeApiConfig.entityName, id: arg.id },
            { type: employeeApiConfig.entityName, id: EntityTagID.LIST },
          ]);

          const newEmployee = new Employee({
            ...omit(updatedEntityData, 'id'),
            url: `${apiConfig.root}${employeeApiConfig.baseEndpoint}${arg.id}/`,
          });

          for (const { endpointName, originalArgs } of cachedQueries) {
            dispatch(
              employeeApi.util.updateQueryData(
                endpointName as 'searchInfinite',
                originalArgs as any,
                (endpointData) => {
                  if ('results' in endpointData && Array.isArray(endpointData.results)) {
                    const existingIndex = endpointData.results.findIndex((item) => item.id === arg.id);

                    if (existingIndex !== -1) {
                      endpointData.results[existingIndex] = merge(endpointData.results[existingIndex], newEmployee);
                    }
                  }
                },
              ),
            );
          }
          /* eslint-disable no-empty */
        } catch (error) {}
        /* eslint-enable no-empty */
      },
    }),
    delete: builder.mutation<void, number>({
      query: (id) => ({
        method: 'delete',
        url: `${employeeApiConfig.baseEndpoint}${id}/`,
      }),
      async onQueryStarted(id, { queryFulfilled, getState, dispatch }) {
        await queryFulfilled;

        const cachedQueries = employeeApi.util.selectInvalidatedBy(getState(), [
          { type: employeeApiConfig.entityName, id: EntityTagID.LIST },
        ]);

        for (const { endpointName, originalArgs } of cachedQueries) {
          dispatch(
            employeeApi.util.updateQueryData(endpointName as 'searchInfinite', originalArgs as any, (endpointData) => {
              const existingItemIndex = endpointData.results.findIndex((item) => item.id === id);

              if (existingItemIndex !== -1) {
                endpointData.results.splice(existingItemIndex, 1);
              }
            }),
          );
        }
      },
    }),
  }),
});
