'use client';

import { HeroUIProvider } from '@heroui/react';
import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { storeActions } from '@ronas-it/rtkq-entity-api';
import { browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import { Fragment, PropsWithChildren, ReactElement, ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from '@tellme/shared/ui/toast';
import { employeeApi } from '@tellme/web/shared/data-access/api';
import { authActions, firebaseAuth, useLocalLogout } from '@tellme/web/shared/data-access/auth';
import { CookieService } from '@tellme/web/shared/data-access/cookies';
import { store } from '@tellme/web/shared/data-access/store';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';

export function App({ children }: PropsWithChildren): ReactNode {
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();
  const logoutLocally = useLocalLogout();
  const router = useRouter();

  useEffect(() => {
    dispatch(storeActions.init());
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (profile) => {
      dispatch(authActions.setProfile(profile));

      if (profile) {
        const persistenceType = CookieService.get('persistence');

        if (persistenceType === browserLocalPersistence.type) {
          const employeeProfile = await dispatch(employeeApi.endpoints.getProfile.initiate()).unwrap();

          const expirationDate = DateTime.local().plus({ days: 14 }).toJSDate();
          CookieService.set(
            {
              isAuthenticated: 'true',
              isOrganizationAdmin: String(employeeProfile.isOrganizationAdmin),
              persistence: browserLocalPersistence.type,
            },
            { expires: expirationDate },
          );
        }
      } else {
        logoutLocally();
        router.replace(navigationConfig.routes.public.root);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [firebaseAuth]);

  return children;
}

export function Providers({ children }: PropsWithChildren): ReactElement {
  return (
    <Fragment>
      <ToastContainer />
      <Provider store={store}>
        <HeroUIProvider>
          <App>{children}</App>
        </HeroUIProvider>
      </Provider>
    </Fragment>
  );
}
