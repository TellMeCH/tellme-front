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
        base: ['max-w-[302px]'],
        content: ['shadow-lg rounded-lg px-4 py-2'],
      }}
      {...restProps}>
      {children}
    </Tooltip>
  );
};
