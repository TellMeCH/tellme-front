import { Tooltip as HeroUITooltip, TooltipProps } from '@heroui/react';
import { ReactNode } from 'react';

export const Tooltip = ({ children, ...restProps }: TooltipProps): ReactNode => {
  return (
    <HeroUITooltip
      showArrow
      classNames={{
        base: ['max-w-[302px]'],
        content: ['shadow-lg rounded-lg px-4 py-2'],
      }}
      {...restProps}>
      {children}
    </HeroUITooltip>
  );
};
