import { Middleware, Reducer } from '@reduxjs/toolkit';
import { AppStateFromRootReducer, createStoreInitializer } from '@ronas-it/rtkq-entity-api';
import { topicApi } from '@tellme/web/shared/data-access/api';
import { firebaseAuthListenerMiddleware } from '@tellme/web/shared/data-access/firebase-auth';

export type AppState = AppStateFromRootReducer<typeof rootReducer>;

const rootReducer = {
  [topicApi.reducerPath]: topicApi.reducer,
};

const middlewares: Array<Middleware> = [firebaseAuthListenerMiddleware.middleware, topicApi.middleware];

const initStore = createStoreInitializer({
  rootReducer: rootReducer as unknown as Reducer<AppState>,
  middlewares,
});

export const store = initStore();
