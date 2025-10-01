import { notFound } from 'next/navigation';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ReactElement, ReactNode } from 'react';
import { Locale } from '@tellme/shared/utils/i18n';
import { Providers } from './providers';
import '@tellme/shared/ui/styles/global';
import { NextIntlClientProvider } from 'next-intl';
import { constants } from '@tellme/shared/utils/constants';
import process from 'node:process';

export const metadata = {
  title: 'tellme',
};

export interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: Locale }>;
}

const locales = constants.locales;

export const generateStaticParams = (): Array<{ locale: Locale }> => locales.map((locale) => ({ locale }));

export default async function RootLayout({ children, params }: RootLayoutProps): Promise<ReactElement> {
  const { locale } = await params;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        <meta name='robots' content={process.env.NEXT_PUBLIC_ENV === 'prod' ? 'index' : 'noindex'} />
      </head>
      <body>
        <div className='min-w-[1280px]'>
          <NextIntlClientProvider messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
        </div>
      </body>
    </html>
  );
}
