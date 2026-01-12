'use client';

import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import { Icon } from '@tellme/shared/ui/ui-kit';

export function BackButton(): ReactElement {
  const router = useRouter();

  const handleClick = (): void => {
    router.back();
  };

  return (
    <button onClick={handleClick}>
      <Icon name='back' />
    </button>
  );
}
