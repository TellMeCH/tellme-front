'use client';

import { useRouter } from 'next/navigation';

export const useBackNavigationHandler = (): (() => void) => {
  const router = useRouter();

  return () => router.back();
};
