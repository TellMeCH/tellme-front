import { organization } from '../organization';

export const admin = {
  url: 'https://tellme-service-716439647851.europe-west6.run.app/api/v1/employees/3/',
  created: '2025-03-25T13:58:18.347Z',
  updated: '2025-03-25T13:58:18.347Z',
  user: {
    email: 'admin@example.com',
    auth_type: 'password',
    first_name: 'Alice',
    last_name: 'Smith',
  },
  role: 'ANALYST',
  is_organization_admin: true,
  organization: organization.url,
};
