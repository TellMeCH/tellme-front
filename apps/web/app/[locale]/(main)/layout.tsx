'use client';

import { useRouter } from 'next/navigation';
import { PropsWithChildren, ReactElement } from 'react';
import { Layout } from '@tellme/web/shared/features/layout';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';

export default function MainLayout({ children }: PropsWithChildren): ReactElement {
  const router = useRouter();

  const navigateToLogin = (): void => router.replace(navigationConfig.routes.public.root);

  return <Layout onLogoutSuccess={navigateToLogin}>{children}</Layout>;
}
