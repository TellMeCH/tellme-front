import { createListenerMiddleware } from '@reduxjs/toolkit';
import { tokenInterceptor } from '@ronas-it/axios-api-client';
import { storeActions } from '@ronas-it/rtkq-entity-api';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import { authSelectors, AuthState } from './slice';

export const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  actionCreator: storeActions.init,
  effect: async (_, { getState }) => {
    apiService.useInterceptors({
      request: [
        [
          tokenInterceptor({
            getToken: () => {
              const profile = authSelectors.profile(getState() as { auth: AuthState });

              return profile?.getIdToken() || '';
            },
          }),
        ],
      ],
    });
  },
});
