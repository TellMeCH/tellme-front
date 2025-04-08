import { ReactElement } from 'react';
import { CloseButtonProps } from 'react-toastify';
import { Icon } from '@tellme/shared/ui/ui-kit';

export function CloseButton({ closeToast }: CloseButtonProps): ReactElement {
  return (
    <button
      onClick={closeToast}
      className='w-8 h-8 rounded-full bg-brand-background bg-opacity-10 basis-[32px] flex-grow-0 flex-shrink-0'>
      <Icon name='cross' theme='bg_primary' />
    </button>
  );
}
