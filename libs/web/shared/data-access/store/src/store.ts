import { Middleware, Reducer } from '@reduxjs/toolkit';
import { AppStateFromRootReducer, createStoreInitializer } from '@ronas-it/rtkq-entity-api';
import { topicApi } from '@tellme/web/shared/data-access/api';
import { authListenerMiddleware } from '@tellme/web/shared/data-access/auth';

export type AppState = AppStateFromRootReducer<typeof rootReducer>;

const rootReducer = {
  [topicApi.reducerPath]: topicApi.reducer,
};

const middlewares: Array<Middleware> = [authListenerMiddleware.middleware, topicApi.middleware];

const initStore = createStoreInitializer({
  rootReducer: rootReducer as unknown as Reducer<AppState>,
  middlewares,
});

export const store = initStore();
