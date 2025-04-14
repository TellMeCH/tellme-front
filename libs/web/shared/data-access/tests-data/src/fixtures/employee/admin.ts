import { organization } from '../organization';

export const admin = {
  user: {
    email: 'admin@example.com',
    auth_type: 'password',
    first_name: 'Alice',
    last_name: 'Smith',
  },
  is_organization_admin: true,
  organization: organization.url,
};
