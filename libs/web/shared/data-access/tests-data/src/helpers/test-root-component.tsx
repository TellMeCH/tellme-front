import { User } from 'firebase/auth';
import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren, ReactElement, ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import { employeeApi, organizationApi, topicApi } from '@tellme/web/shared/data-access/api';
import { authActions } from '@tellme/web/shared/data-access/auth';
import { store } from '@tellme/web/shared/data-access/store';
/* eslint-disable @nx/enforce-module-boundaries */
import sharedMessages from '../../../../../../../i18n/shared/en.json';
import accountMessages from '../../../../../../../i18n/web/account/en.json';
import webSharedMessages from '../../../../../../../i18n/web/shared/en.json';
import topicMessages from '../../../../../../../i18n/web/topic/en.json';
import { profile } from '../fixtures';
/* eslint-enable @nx/enforce-module-boundaries */

const messages = {
  account: accountMessages,
  'web-shared': webSharedMessages,
  topic: topicMessages,
  shared: sharedMessages,
};

interface Props extends PropsWithChildren {
  shouldAuthorize?: boolean;
}

function TestApp({ children, shouldAuthorize }: Props): ReactNode {
  const dispatch = useDispatch();

  useEffect(() => {
    if (shouldAuthorize) {
      dispatch(authActions.setProfile(profile as User));
    }

    return () => {
      dispatch(authActions.setProfile(null));
      dispatch(employeeApi.util.resetApiState());
      dispatch(organizationApi.util.resetApiState());
      dispatch(topicApi.util.resetApiState());
    };
  }, []);

  return children;
}

export function TestRootComponent({ children, shouldAuthorize }: Props): ReactElement {
  return (
    <NextIntlClientProvider messages={messages} locale='en'>
      <Provider store={store}>
        <TestApp shouldAuthorize={shouldAuthorize}>{children}</TestApp>
      </Provider>
    </NextIntlClientProvider>
  );
}
