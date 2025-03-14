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
      tertiary: styles.button_tertiary,
    },
    isDisabled: {
      true: '',
    },
    isLoading: {
      true: '',
    },
    size: {
      md: styles.button_md,
    },
    isIconOnly: {
      true: styles.button_icon,
    },
    fullWidth: {
      true: styles.button_full,
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'solid',
    isDisabled: false,
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
