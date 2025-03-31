import { getRequestConfig } from 'next-intl/server';
import { constants } from '@tellme/shared/utils/constants';
import type { Locale } from '@tellme/shared/utils/i18n';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !constants.locales.includes(locale as Locale)) {
    locale = constants.defaultLocale;
  }

  return {
    locale,
    messages: {
      'landing-shared': (await import(`../../../i18n/landing/shared/${locale}.json`)).default,
    },
  };
});
