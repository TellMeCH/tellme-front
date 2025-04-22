import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ReactElement, ReactNode } from 'react';
import { constants } from '@tellme/shared/utils/constants';
import { Locale } from '@tellme/shared/utils/i18n';
import '@tellme/shared/ui/styles/global';
import * as process from 'node:process';
import { ToastContainer } from '@tellme/shared/ui/toast';

export const metadata = {
  title: 'tellme',
  description: `If data is the new gold, your call center conversations are an unexploited gold mine. \
    We transcribe and analyze your call recordings with AI to provide actionable insights \
    that will boost your understanding of your customers and your call center operations.`,
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
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ToastContainer />
          <div className='bg-background-landing text-lg max-lg:text-base'>{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
