import { Middleware, Reducer } from '@reduxjs/toolkit';
import { AppStateFromRootReducer, createStoreInitializer } from '@ronas-it/rtkq-entity-api';
import {
  topicApi,
  organizationApi,
  employeeApi,
  suggestedTopicApi,
  customerApi,
  conversationApi,
} from '@tellme/web/shared/data-access/api';
import { authListenerMiddleware, authReducer, authReducerPath } from '@tellme/web/shared/data-access/auth';

export type AppState = AppStateFromRootReducer<typeof rootReducer>;

const rootReducer = {
  [authReducerPath]: authReducer,
  [topicApi.reducerPath]: topicApi.reducer,
  [organizationApi.reducerPath]: organizationApi.reducer,
  [employeeApi.reducerPath]: employeeApi.reducer,
  [suggestedTopicApi.reducerPath]: suggestedTopicApi.reducer,
  [customerApi.reducerPath]: customerApi.reducer,
  [conversationApi.reducerPath]: conversationApi.reducer,
};

const middlewares: Array<Middleware> = [
  authListenerMiddleware.middleware,
  topicApi.middleware,
  organizationApi.middleware,
  employeeApi.middleware,
  suggestedTopicApi.middleware,
  customerApi.middleware,
  conversationApi.middleware,
];

const initStore = createStoreInitializer({
  rootReducer: rootReducer as unknown as Reducer<AppState>,
  middlewares,
});

export const store = initStore();
