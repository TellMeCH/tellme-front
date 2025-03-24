import { ApiService } from '@ronas-it/axios-api-client';
import { apiConfig } from './configuration';

export const apiService = new ApiService(apiConfig.root);
