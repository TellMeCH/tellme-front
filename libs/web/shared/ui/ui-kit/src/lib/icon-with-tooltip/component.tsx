import React from 'react';
import { Icon, IconProps } from '@tellme/shared/ui/ui-kit';
import { TooltipWrapper, TooltipWrapperProps } from '../tooltip-wrapper/component';

export interface IconWithTooltipProps extends Partial<IconProps> {
  tooltipProps: Omit<TooltipWrapperProps, 'children'>;
}

export const IconWithTooltip = ({ tooltipProps, name = 'info', ...rest }: IconWithTooltipProps): React.ReactElement => {
  return (
    <TooltipWrapper {...tooltipProps} offset={-6}>
      <span tabIndex={0}>
        <Icon
          name={'info'}
          theme='primary'
          {...rest} />
      </span>
    </TooltipWrapper>
  );
};
