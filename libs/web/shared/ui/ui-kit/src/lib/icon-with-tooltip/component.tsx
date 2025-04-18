import { TooltipProps } from '@heroui/react';
import { ReactElement } from 'react';
import { Icon, IconName, IconTheme } from '@tellme/shared/ui/ui-kit';
import { Tooltip } from '../tooltip/component';

export interface IconWithTooltipProps extends TooltipProps {
  iconName?: IconName;
  iconTheme?: IconTheme;
  iconClassName?: string;
}

export const IconWithTooltip = ({
  iconName = 'info',
  iconTheme,
  iconClassName,
  ...restTooltipProps
}: IconWithTooltipProps): ReactElement => {
  return (
    <Tooltip {...restTooltipProps}>
      <span tabIndex={0} className='inline-flex items-center'>
        <Icon
          name={iconName}
          theme={iconTheme}
          className={iconClassName} />
      </span>
    </Tooltip>
  );
};
