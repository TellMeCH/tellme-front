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
      'web-shared': (await import(`../../../i18n/web/shared/${locale}.json`)).default,
      topic: (await import(`../../../i18n/web/topic/${locale}.json`)).default,
      account: (await import(`../../../i18n/web/account/${locale}.json`)).default,
      shared: (await import(`../../../i18n/shared/${locale}.json`)).default,
      administration: (await import(`../../../i18n/web/administration/${locale}.json`)).default,
      'customer-experience': (await import(`../../../i18n/web/customer-experience/${locale}.json`)).default,
    },
  };
});
