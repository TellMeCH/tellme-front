import { NextIntlClientProvider } from 'next-intl';
import { PropsWithChildren, ReactElement } from 'react';
import { Provider } from 'react-redux';
import { store } from '@tellme/web/shared/data-access/store';
/* eslint-disable @nx/enforce-module-boundaries */
import accountMessages from '../../../../../../../i18n/web/account/en.json';
import webSharedMessages from '../../../../../../../i18n/web/shared/en.json';
import topicMessages from '../../../../../../../i18n/web/topic/en.json';
/* eslint-enable @nx/enforce-module-boundaries */

const messages = {
  account: accountMessages,
  'web-shared': webSharedMessages,
  topic: topicMessages,
};

export function TestRootComponent({ children }: PropsWithChildren): ReactElement {
  return (
    <NextIntlClientProvider messages={messages} locale='en'>
      <Provider store={store}>{children}</Provider>
    </NextIntlClientProvider>
  );
}
