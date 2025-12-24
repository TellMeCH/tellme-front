import createMiddleware from 'next-intl/middleware';
import { constants } from '@tellme/shared/utils/constants';

export const proxy = createMiddleware({
  locales: constants.locales,
  defaultLocale: constants.defaultLocale,
  localePrefix: 'never',
});

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
