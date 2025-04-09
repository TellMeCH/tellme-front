'use client';

import { HeroUIProvider } from '@heroui/react';
import { storeActions } from '@ronas-it/rtkq-entity-api';
import { onAuthStateChanged } from 'firebase/auth';
import { Fragment, PropsWithChildren, ReactElement, ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { ToastContainer } from '@tellme/shared/ui/toast';
import { authActions, firebaseAuth } from '@tellme/web/shared/data-access/auth';
import { store } from '@tellme/web/shared/data-access/store';

export function App({ children }: PropsWithChildren): ReactNode {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(storeActions.init());
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (profile) => {
      dispatch(authActions.setProfile(profile));
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
