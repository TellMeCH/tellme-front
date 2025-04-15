import { organization } from '../organization';
import { admin } from './admin';

export const employeesPaginationResponse = {
  next: null,
  previous: null,
  results: [
    {
      url: 'https://tellme-service-716439647851.europe-west6.run.app/api/v1/employees/2/',
      created: '2025-03-24T13:58:18.347Z',
      updated: '2025-03-24T13:58:18.347Z',
      user: {
        email: 'cody_fisher@gmail.com',
        auth_type: 'google',
        first_name: 'Cody',
        last_name: 'Fisher',
      },
      role: 'AGENT',
      is_organization_admin: false,
      organization: organization.url,
    },
    admin,
    {
      url: 'https://tellme-service-716439647851.europe-west6.run.app/api/v1/employees/1/',
      created: '2025-03-22T13:58:18.347Z',
      updated: '2025-03-22T13:58:18.347Z',
      user: {
        email: 'ablack84@gmail.com',
        auth_type: 'password',
        first_name: 'Annette',
        last_name: 'Black',
      },
      role: 'ANALYST',
      is_organization_admin: true,
      organization: organization.url,
    },
  ],
};
