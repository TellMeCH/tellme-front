import { pick } from 'lodash';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ReactElement, ReactNode } from 'react';
import { constants } from '@tellme/shared/utils/constants';
import { Locale } from '@tellme/shared/utils/i18n';
import '@tellme/shared/ui/styles/global';

export const metadata = {
  title: 'Tellme',
  description:
    'If data is the new gold, your call center conversations are an unexploited gold mine. ' +
    'We transcribe and analyze your call recordings with AI to provide actionable insights ' +
    'that will boost your understanding of your customers and your call center operations.',
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
        {/* TODO: turn on indexing right before release */}
        <meta name='robots' content='noindex' />
      </head>
      <body>
        <NextIntlClientProvider messages={pick(messages, 'landing-shared')} locale={locale}>
          <div className='text-lg max-lg:text-base'>{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
