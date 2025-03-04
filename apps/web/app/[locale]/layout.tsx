import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';
import { ReactElement, ReactNode } from 'react';
import { Locale } from '@tellme/web/shared/utils/i18n';
import { constants } from '../../constants';
import { Providers } from './providers';
import '@tellme/web/shared/ui/styles/global';

export const metadata = {
  title: 'Tellme',
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

  return (
    <html lang={locale}>
      <head>
        <meta name='robots' content={process.env.NEXT_PUBLIC_APP_ENV === 'production' ? 'index' : 'noindex'} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
