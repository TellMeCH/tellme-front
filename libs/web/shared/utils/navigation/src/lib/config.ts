import { CustomerSearchParams } from '@tellme/web/shared/utils/filtering-search-params';
import { getLinkBuilder } from './utils';

const customerExperiencesBasePath = '/customer-experiences';
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
      customerExperiences: {
        list: getLinkBuilder<CustomerSearchParams>(customerExperiencesBasePath),
        view: (id: number, conversationId?: number): string =>
          `${customerExperiencesBasePath}/${id}${conversationId ? `?conversationId=${conversationId}` : ''}`,
      },
    },
  },
};
