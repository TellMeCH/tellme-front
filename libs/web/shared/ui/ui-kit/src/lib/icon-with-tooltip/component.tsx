import React from 'react';
import { Icon, IconProps } from '@tellme/shared/ui/ui-kit';
import { TooltipWrapper, TooltipWrapperProps } from '../tooltip-wrapper/component';

export interface IconWithTooltipProps {
  iconProps: IconProps;
  tooltipProps: Omit<TooltipWrapperProps, 'children'>;
}

export const IconWithTooltip = ({ tooltipProps, iconProps }: IconWithTooltipProps): React.ReactElement => {
  return (
    <TooltipWrapper {...tooltipProps}>
      <Icon {...iconProps} />;
    </TooltipWrapper>
  );
};
