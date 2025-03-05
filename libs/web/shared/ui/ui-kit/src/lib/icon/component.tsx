import clsx from 'clsx';
import { ReactElement } from 'react';
import styles from './component.module.scss';

export type IconTheme = 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger';

export type IconName =
  | 'calendar'
  | 'logout'
  | 'label'
  | 'chart'
  | 'menu'
  | 'mail'
  | 'lock'
  | 'eye'
  | 'arrow_up'
  | 'pen'
  | 'trash'
  | 'google'
  | 'microsoft'
  | 'facebook'
  | 'twitter'
  | 'instagram'
  | 'eye_closed';

export interface IconProps {
  name: IconName;
  theme?: IconTheme;
  className?: string;
}

export function Icon({ name, theme, className }: IconProps): ReactElement {
  return (
    <span
      className={clsx(
        styles.icon,
        styles[`icon_${name}`],
        theme && styles.icon_mask,
        !!theme && styles[`icon_${theme}`],
        className,
      )}
    />
  );
}

export default Icon;
