import clsx from 'clsx';
import { ReactElement } from 'react';

interface LegendProps {
  color?: string;
  label: string;
  isFlipped?: boolean;
}

export function Legend({ color, label, isFlipped }: LegendProps): ReactElement {
  return (
    <p className={clsx('relative flex items-center gap-[10px]', isFlipped && 'flex-row-reverse')}>
      <span className='w-3 h-3 rounded-full' style={{ backgroundColor: color }} />
      {label}
    </p>
  );
}
