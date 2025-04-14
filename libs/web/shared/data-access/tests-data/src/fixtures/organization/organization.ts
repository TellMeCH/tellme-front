import { topicsPaginationResponse } from '../topic';

export const organization = {
  url: 'https://tellme-service-716439647851.europe-west6.run.app/api/v1/organizations/326/',
  name: 'ACME Org',
  conversation_count: 50,
  max_user_count: 30,
  employees_count: topicsPaginationResponse.results.length,
  created: '2025-04-08T10:18:13.503290Z',
  updated: '2025-04-08T10:18:13.503308Z',
  transcription_method: 'groq',
};
