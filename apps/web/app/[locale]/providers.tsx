'use client';

import { HeroUIProvider } from '@heroui/react';
import { storeActions } from '@ronas-it/rtkq-entity-api';
import { Fragment, PropsWithChildren, ReactElement, ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { store } from '@tellme/web/shared/data-access/store';
import { ToastContainer } from '@tellme/web/shared/features/toast-service';

export function App({ children }: PropsWithChildren): ReactNode {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(storeActions.init());
  }, []);

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
