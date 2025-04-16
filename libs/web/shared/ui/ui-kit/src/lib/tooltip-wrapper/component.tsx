import { Tooltip, TooltipProps } from '@heroui/react';
import { ReactNode } from 'react';

export interface TooltipWrapperProps extends TooltipProps {
  children: ReactNode;
}

export const TooltipWrapper = ({ children, ...restProps }: TooltipWrapperProps): ReactNode => {
  return (
    <Tooltip
      showArrow
      classNames={{
        base: ['before:bg-text-primary'],
        content: ['bg-text-primary text-text-foreground rounded-lg text-base px-4 py-2'],
      }}
      {...restProps}>
      {children}
    </Tooltip>
  );
};
