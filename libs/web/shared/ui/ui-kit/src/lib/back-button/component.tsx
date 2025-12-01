'use client';

import { useRouter } from 'next/navigation';
import { ReactElement } from 'react';
import { Icon } from '@tellme/shared/ui/ui-kit';

interface BackButtonProps {
  link?: string;
}

export function BackButton({ link }: BackButtonProps): ReactElement {
  const router = useRouter();

  const handleClick = () => {
    if (link) {
      router.push(link);
    } else {
      router.back();
    }
  };

  return (
    <button onClick={handleClick}>
      <Icon name='back' />
    </button>
  );
}
