import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { constants } from '@tellme/shared/utils/constants';
import { Locale } from '@tellme/shared/utils/i18n';
import { cookieConfig } from '@tellme/web/shared/data-access/cookies';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';

const intlMiddleware = createMiddleware({
  locales: constants.locales,
  defaultLocale: constants.defaultLocale,
  localePrefix: 'never',
});

const publicRoutes = Object.values(navigationConfig.routes.public);
const privateRoutes = [
  navigationConfig.routes.private.dashboard,
  navigationConfig.routes.private.topics,
  navigationConfig.routes.private.topicAnalysis,
  navigationConfig.routes.private.administration,
  navigationConfig.routes.private.customerExperiences.list(),
];

const isPathnameMatchingRoutes = (pathnameToCompare: string, routes: Array<string>): boolean => {
  return routes.some((route) =>
    pathnameToCompare === '/' ? pathnameToCompare === route : pathnameToCompare.startsWith(route),
  );
};

const redirectToPage = (request: NextRequest, route: string): NextResponse => {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split('/');
  const languageCode = constants.locales.includes(segments[0] as Locale) ? segments[0] : '';
  const newUrl = new URL(`${languageCode}${route}`, request.url);

  return NextResponse.redirect(newUrl);
};

const postHogProxyPath = '/relay-FJ0S/';
const postHogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST as string;
const regularPostHogDomain = postHogHost.replace(/^https?:\/\//, '');
const assetsPostHogDomain = regularPostHogDomain.replace(/^eu/, 'eu-assets');

const redirectToPosthog = (request: NextRequest): NextResponse => {
  const url = request.nextUrl.clone();
  const hostname = url.pathname.startsWith(postHogProxyPath + 'static/') ? assetsPostHogDomain : regularPostHogDomain;

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('host', hostname);

  url.protocol = 'https';
  url.hostname = hostname;
  url.port = '443';
  url.pathname = url.pathname.replace(new RegExp(`^${postHogProxyPath}`), '');

  return NextResponse.rewrite(url, {
    headers: requestHeaders,
  });
};

export default async function middleware(request: NextRequest): Promise<NextResponse> {
  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith(postHogProxyPath)) {
    return redirectToPosthog(request);
  }

  const isAuthenticated = request.cookies.get(cookieConfig.keys.isAuthenticated)?.value === 'true';
  const isOrganizationAdmin = request.cookies.get(cookieConfig.keys.isOrganizationAdmin)?.value === 'true';

  if (!isAuthenticated && isPathnameMatchingRoutes(pathname, privateRoutes)) {
    return redirectToPage(request, navigationConfig.routes.public.root);
  }

  if (
    (isAuthenticated && isPathnameMatchingRoutes(pathname, publicRoutes)) ||
    (!isOrganizationAdmin && pathname === navigationConfig.routes.private.administration)
  ) {
    return redirectToPage(request, navigationConfig.routes.private.dashboard);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/relay-FJ0S/:path*', '/((?!api|_next|.*\\..*).*)'],
};
