import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { cookieConfig } from '@tellme/web/shared/data-access/cookies';
import { Locale } from '@tellme/web/shared/utils/i18n';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';
import { constants } from './constants';

const intlMiddleware = createMiddleware({
  locales: constants.locales,
  defaultLocale: constants.defaultLocale,
  localePrefix: 'never',
});

const publicRoutes = Object.values(navigationConfig.routes.public);
const privateRoutes = Object.values(navigationConfig.routes.private);

const isPathnameMatchingRoutes = (pathnameToCompare: string, routes: Array<string>): boolean => {
  return routes.some((route) => pathnameToCompare === route);
};

const redirectToPage = (request: NextRequest, route: string): NextResponse => {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/');
  const languageCode = constants.locales.includes(segments[0] as Locale) ? segments[0] : '';
  const newUrl = new URL(`${languageCode}${route}`, request.url);

  return NextResponse.redirect(newUrl);
};

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;
  const value = request.cookies.get(cookieConfig.keys.isAuthenticated)?.value;
  const isAuthenticated = value === 'true';

  if (!isAuthenticated && isPathnameMatchingRoutes(pathname, privateRoutes)) {
    return redirectToPage(request, navigationConfig.routes.public.root);
  }

  if (isAuthenticated && isPathnameMatchingRoutes(pathname, publicRoutes)) {
    return redirectToPage(request, navigationConfig.routes.private.dashboard);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};
