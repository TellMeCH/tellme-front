import clsx from 'clsx';
import { ReactElement } from 'react';
import { TranscriptItem, TranscriptItemClass } from '@tellme/web/shared/data-access/api';

interface MessageProps {
  transcriptItem: TranscriptItem;
  customerFullName: string;
}

export function Message({ transcriptItem, customerFullName }: MessageProps): ReactElement {
  const isCustomerMessage = transcriptItem.class === TranscriptItemClass.CUSTOMER_MESSAGE;

  return (
    <div
      className={clsx(
        'rounded-xl px-3 py-2 mb-4 last:mb-0',
        isCustomerMessage ? 'bg-background-secondary rounded-bl-0' : 'bg-brand-primary rounded-br-0',
      )}>
      {isCustomerMessage && <p className='font-bold mb-1 text-xs'>{customerFullName}</p>}
      <p className={clsx('text-sm', !isCustomerMessage && 'bg-background-secondary')}>{transcriptItem.message}</p>
    </div>
  );
}
