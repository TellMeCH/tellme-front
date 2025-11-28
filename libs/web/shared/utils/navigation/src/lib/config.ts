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
      customerExperiences: getResourcePaths('/customer-experiences'),
    },
  },
};
