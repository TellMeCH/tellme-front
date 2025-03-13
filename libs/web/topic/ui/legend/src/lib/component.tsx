import { ReactElement } from 'react';

interface LegendProps {
  color?: string;
  label: string;
}

export function Legend({ color, label }: LegendProps): ReactElement {
  return (
    <p className='relative flex items-center gap-[10px]'>
      <span className='w-3 h-3 rounded-full' style={{ backgroundColor: color }} />
      {label}
    </p>
  );
}
