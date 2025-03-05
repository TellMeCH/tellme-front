'use client';

import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import { Login } from '@tellme/web/account/features/login';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';

export default function LoginPage(): ReactElement {
  const router = useRouter();

  const navigateToDashboard = (): void => router.replace(navigationConfig.routes.private.dashboard);

  return <Login onSuccess={navigateToDashboard} />;
}
