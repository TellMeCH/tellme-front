import '@tellme/shared/ui/styles/global';
import * as process from 'node:process';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { ReactElement, ReactNode } from 'react';
import { ToastContainer } from '@tellme/shared/ui/toast';
import { constants } from '@tellme/shared/utils/constants';
import { Locale } from '@tellme/shared/utils/i18n';
import { StructuredData } from '../_components/StructuredData';
import type { Metadata } from 'next';

const SITE_NAME = 'tellme';
const TAGLINE = 'The right call to know your customers';
const DESCRIPTION =
  'Tellme transcribes and analyzes your call recordings with AI to provide actionable insights that will boost your understanding of your customers and the efficiency of your call center.';
const ALT_TEXT = 'Turn conversations into actionable insights.';
const KEYWORDS = [
  'call-center analytics',
  'speech analytics',
  'AI transcription',
  'customer experience',
  'B2B SaaS',
  'CX',
  'AI',
];
const ogImage = '/call-center.png';
const BASE_URL = process.env.NEXT_PUBLIC_ENV === 'prod' ? 'https://tell-me.ch' : 'http://localhost:3000';
const TWITTER_HANDLE = '@tellme_ch';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
    languages: {
      en: '/en',
    },
  },
  title: {
    default: `${SITE_NAME} - ${TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: DESCRIPTION,
  keywords: KEYWORDS,
  openGraph: {
    title: `${SITE_NAME} – ${TAGLINE}`,
    description: DESCRIPTION,
    url: `${BASE_URL}/`,
    siteName: SITE_NAME,
    images: [{ url: ogImage, width: 1200, height: 630, alt: ALT_TEXT }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} – ${TAGLINE}`,
    description: DESCRIPTION,
    images: [ogImage],
    site: TWITTER_HANDLE,
    creator: TWITTER_HANDLE,
  },
  robots: {
    index: process.env.NEXT_PUBLIC_ENV === 'prod',
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/site.webmanifest',
};

export interface RootLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

const locales = constants.locales;

export const generateStaticParams = (): Array<{ locale: string }> => locales.map((locale) => ({ locale }));

export default async function RootLayout({ children, params }: RootLayoutProps): Promise<ReactElement> {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  setRequestLocale(locale as Locale);

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ToastContainer />
          <StructuredData />
          <div className='bg-background-landing text-lg max-lg:text-base'>{children}</div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
