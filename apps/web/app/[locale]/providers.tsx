import { HeroUIProvider } from '@heroui/react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ReactElement, PropsWithChildren, Fragment } from 'react';
import { ToastContainer } from '@tellme/web/shared/features/toast-service';

export function Providers({ children }: PropsWithChildren): ReactElement {
  const messages = useMessages();

  return (
    <Fragment>
      <ToastContainer />
      <NextIntlClientProvider messages={messages}>
        <HeroUIProvider>{children}</HeroUIProvider>
      </NextIntlClientProvider>
    </Fragment>
  );
}
