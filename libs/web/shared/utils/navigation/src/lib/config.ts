import { CustomerSearchParams } from '@tellme/web/shared/utils/filtering-search-params';
import { getResourcePaths } from './utils';

export const navigationConfig = {
  routes: {
    public: {
      root: '/',
    },
    private: {
      dashboard: '/dashboard',
      topics: '/topics',
      topicAnalysis: '/topic-analysis',
      administration: '/administration',
      customerExperiences: getResourcePaths<CustomerSearchParams>('/customer-experiences'),
    },
  },
};
