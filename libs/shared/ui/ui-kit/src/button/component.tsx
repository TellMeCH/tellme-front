'use client';

import { Button as NextUIButton, ButtonProps, extendVariants } from '@heroui/react';
import clsx from 'clsx';
import { forwardRef, JSXElementConstructor, ReactElement } from 'react';
import styles from './component.module.scss';

const BaseButton = extendVariants(NextUIButton, {
  variants: {
    variant: {
      solid: clsx(styles.buttonRoot, styles.button),
      bordered: clsx(styles.buttonRoot, styles.button),
      light: clsx(styles.buttonRoot, styles.button),
    },
    color: {
      primary: '',
      light: '',
    },
    isDisabled: {
      true: '',
    },
    isLoading: {
      true: '',
    },
    size: {
      md: styles.button_md,
      lg: styles.button_lg,
    },
    isIconOnly: {
      true: styles.button_icon,
    },
    fullWidth: {
      true: styles.button_full,
    },
    radius: {
      md: styles.button_radius_md,
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'solid',
    isDisabled: false,
    radius: 'md',
  },
  compoundVariants: [
    {
      variant: 'solid',
      color: 'primary',
      class: clsx(styles.button_solid, styles.button_solid_primary),
    },
    {
      variant: 'solid',
      color: 'danger',
      class: clsx(styles.button_solid, styles.button_solid_danger),
    },
    {
      variant: 'solid',
      color: 'default',
      class: clsx(styles.button_solid, styles.button_solid_default),
    },
    {
      variant: 'solid',
      color: 'secondary',
      class: clsx(styles.button_solid, styles.button_solid_secondary),
    },
    {
      isDisabled: true,
      variant: 'solid',
      class: clsx(styles.button_solid, styles.button_solid_disabled),
    },
    {
      variant: 'light',
      color: 'primary',
      class: clsx(styles.button_light, styles.button_light_primary),
    },
    {
      variant: 'light',
      color: 'danger',
      class: clsx(styles.button_light, styles.button_light_danger),
    },
    {
      variant: 'light',
      color: 'secondary',
      class: clsx(styles.button_light, styles.button_light_secondary),
    },
    {
      isDisabled: true,
      variant: 'bordered',
      class: styles.button_bordered_disabled,
    },
    {
      variant: 'bordered',
      color: 'primary',
      class: clsx(styles.button_bordered, styles.button_bordered_primary),
    },
    {
      variant: 'bordered',
      color: 'danger',
      class: clsx(styles.button_bordered, styles.button_bordered_danger),
    },
    {
      variant: 'bordered',
      color: 'secondary',
      class: clsx(styles.button_bordered, styles.button_bordered_secondary),
    },
  ],
});

export const Button = forwardRef<ReactElement<unknown, string | JSXElementConstructor<any>> | null, ButtonProps>(
  (props, ref) => {
    return <BaseButton
      disableRipple
      {...props}
      ref={ref} />;
  },
);

Button.displayName = 'Button';

export default Button;
