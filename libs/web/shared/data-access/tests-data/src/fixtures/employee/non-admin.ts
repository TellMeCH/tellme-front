import { organization } from '../organization';

export const nonAdmin = {
  user: {
    email: 'test@example.com',
    auth_type: 'password',
    first_name: 'John',
    last_name: 'Doe',
  },
  is_organization_admin: false,
  organization: organization.url,
};
