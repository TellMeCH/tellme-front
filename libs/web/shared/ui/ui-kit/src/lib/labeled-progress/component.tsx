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
        base: 'h-2',
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});

interface LabeledProgressProps extends ProgressProps {
  value: number;
}

export const LabeledProgress = forwardRef<HTMLDivElement, LabeledProgressProps>((props, ref): ReactElement => {
  return (
    <span ref={ref} className='flex flex-row items-center gap-2'>
      <BaseProgress {...props} />
      {props.value}
    </span>
  );
});

LabeledProgress.displayName = 'LabeledProgress';

export default LabeledProgress;
