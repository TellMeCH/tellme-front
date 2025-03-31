import { plainToInstance } from 'class-transformer';
import { createAppApi } from '@tellme/web/shared/data-access/api-client';
import { employeeApiConfig } from './config';
import { Employee } from './models';

export const employeeApi = createAppApi({
  reducerPath: employeeApiConfig.entityName,
  endpoints: (builder) => ({
    getProfile: builder.query<Employee, void>({
      query: () => ({
        method: 'get',
        url: `${employeeApiConfig.baseEndpoint}me/`,
      }),
      transformResponse: (response) => plainToInstance(Employee, response as object),
    }),
  }),
});
