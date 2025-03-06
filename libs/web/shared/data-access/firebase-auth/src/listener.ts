import { createListenerMiddleware } from '@reduxjs/toolkit';
import { tokenInterceptor } from '@ronas-it/axios-api-client';
import { storeActions } from '@ronas-it/rtkq-entity-api';
import { apiService } from '@tellme/web/shared/data-access/api-client';
import { firebaseAuth } from './firebase-auth';

export const firebaseAuthListenerMiddleware = createListenerMiddleware();

firebaseAuthListenerMiddleware.startListening({
  actionCreator: storeActions.init,
  effect: async (_, { dispatch, getState }) => {
    apiService.useInterceptors({
      request: [
        [
          tokenInterceptor({
            getToken: async () => (await firebaseAuth.currentUser?.getIdToken()) || '',
          }),
        ],
      ],
    });
  },
});
