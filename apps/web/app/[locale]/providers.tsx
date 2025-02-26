import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ReactElement, PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren): ReactElement {
  const messages = useMessages();

  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}
