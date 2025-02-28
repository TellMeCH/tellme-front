import { HeroUIProvider } from '@heroui/react';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import { ReactElement, PropsWithChildren } from 'react';

export function Providers({ children }: PropsWithChildren): ReactElement {
  const messages = useMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <HeroUIProvider>{children}</HeroUIProvider>
    </NextIntlClientProvider>
  );
}
