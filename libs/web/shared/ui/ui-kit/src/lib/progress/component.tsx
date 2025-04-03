'use client';

import { Progress as HeroUIProgress, ProgressProps, extendVariants } from '@heroui/react';
import { type ReactElement } from 'react';
import { forwardRef } from 'react';

const BaseProgress = extendVariants(HeroUIProgress, {
  variants: {
    color: {
      primary: {
        track: 'bg-control-primary-transparent',
        indicator: 'bg-control-primary',
      },
      secondary: {
        track: 'bg-control-secondary-transparent',
        indicator: 'bg-control-secondary',
      },
    },
    size: {
      md: {
        base: 'h-2 w-[96%]',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});

interface AppProgressProps extends ProgressProps {
  value: number;
}

export const AppProgress = forwardRef<HTMLDivElement, AppProgressProps>((props, ref): ReactElement => {
  return (
    <span ref={ref} className='flex flex-row justify-between items-center gap-2'>
      <BaseProgress {...props} />
      {props.value}
    </span>
  );
});

AppProgress.displayName = ' AppProgress';

export default AppProgress;
