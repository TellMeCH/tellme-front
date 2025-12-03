import { createEntityInstance, EntityTagID } from '@ronas-it/rtkq-entity-api';
import { plainToInstance } from 'class-transformer';
import { merge, omit } from 'lodash';
import { apiConfig, createAppApi } from '@tellme/web/shared/data-access/api-client';
import { PaginationRequest, PaginationResponse } from '../common';
import {
  createInfiniteQuery,
  createInfiniteQueryOptions,
  createMutationQueryWithData,
  createSearchResponseTransformer,
  findEntityInPages,
} from '../common/utils';
import { organizationApi } from '../organization';
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
    search: builder.infiniteQuery<PaginationResponse<Employee>, PaginationRequest, string | undefined>({
      infiniteQueryOptions: createInfiniteQueryOptions<Employee>(),
      query: createInfiniteQuery(employeeApiConfig.baseEndpoint, PaginationRequest),
      transformResponse: createSearchResponseTransformer<Employee>(Employee),
      providesTags: (data) => {
        return data
          ? [
              { type: employeeApiConfig.entityName, id: EntityTagID.LIST },
              ...data.pages
                .map((response) =>
                  response.results.map((item) => ({
                    type: employeeApiConfig.entityName,
                    id: item.id || item.idFromUrl,
                  })),
                )
                .flat(),
            ]
          : [];
      },
    }),
    create: builder.mutation<ModifiedEmployee, Partial<ModifiedEmployee>>({
      query: createMutationQueryWithData<ModifiedEmployee>(
        'post',
        () => employeeApiConfig.baseEndpoint,
        ModifiedEmployee,
      ),
      transformResponse: (response: object) => createEntityInstance<ModifiedEmployee>(ModifiedEmployee, response),
      async onQueryStarted(_, { queryFulfilled, getState, dispatch }) {
        try {
          const result = (await queryFulfilled).data;
          dispatch(employeeApi.util.invalidateTags([{ type: employeeApiConfig.entityName, id: EntityTagID.LIST }]));

          const employeeProfile = employeeApi.endpoints.getProfile.select()(getState()).data;
          const newEmployee = new Employee({
            ...omit(result, 'id'),
            url: `${apiConfig.root}${employeeApiConfig.baseEndpoint}${result.id}/`,
            updated: result.created,
            organizationUrl: employeeProfile?.organizationUrl,
          });

          dispatch(
            organizationApi.util.updateQueryData(
              'getOrganization',
              { id: newEmployee.organizationId },
              (endpointData) => {
                endpointData.employeesCount++;
              },
            ),
          );
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
      query: createMutationQueryWithData<ModifiedEmployee>(
        'patch',
        (params) => `${employeeApiConfig.baseEndpoint}${params.id}/`,
        ModifiedEmployee,
      ),
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
              employeeApi.util.updateQueryData(endpointName as 'search', originalArgs as any, (endpointData) => {
                if ('pages' in endpointData && Array.isArray(endpointData.pages)) {
                  const { pageIndex, itemIndex } = findEntityInPages(endpointData.pages, arg.id);
                  console.log(pageIndex, itemIndex);

                  if (pageIndex > -1 && itemIndex > -1) {
                    endpointData.pages[pageIndex].results[itemIndex] = merge(
                      endpointData.pages[pageIndex].results[itemIndex],
                      newEmployee,
                    );
                  }
                }
              }),
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
            employeeApi.util.updateQueryData(endpointName as 'search', originalArgs as any, (endpointData) => {
              const { pageIndex, itemIndex } = findEntityInPages(endpointData.pages, id);

              if (pageIndex > -1 && itemIndex > -1) {
                endpointData.pages[pageIndex].results.splice(itemIndex, 1);
                endpointData.pages.filter((pages) => !!pages.results.length);
              }
            }),
          );
        }

        const employeeProfile = employeeApi.endpoints.getProfile.select()(getState()).data;
        dispatch(
          organizationApi.util.updateQueryData(
            'getOrganization',
            { id: Number(employeeProfile?.organizationId) },
            (endpointData) => {
              endpointData.employeesCount--;
            },
          ),
        );
      },
    }),
  }),
});
