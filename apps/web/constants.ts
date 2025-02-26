import type { Locale } from '@tellme/web/shared/utils/i18n';

interface Constants {
  defaultLocale: Locale;
  locales: Array<Locale>;
}

export const constants: Constants = {
  defaultLocale: 'en',
  locales: ['en'],
};
