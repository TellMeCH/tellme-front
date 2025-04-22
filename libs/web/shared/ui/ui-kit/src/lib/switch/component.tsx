'use client';

import { Switch as HeroUISwitch, extendVariants } from '@heroui/react';
import styles from './component.module.scss';

export const Switch = extendVariants(HeroUISwitch, {
  variants: {
    size: {
      md: {
        base: styles.switch,
        wrapper: styles.switch__wrapper_md,
        thumb: styles.switch__thumb,
      },
    },
    color: {
      primary: {
        base: styles.switch,
        wrapper: styles.switch__wrapper_primary,
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});
