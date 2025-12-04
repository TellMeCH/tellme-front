'use client';

import { Chip as HeroUIChip, extendVariants } from '@heroui/react';
import styles from './component.module.scss';

export const Chip = extendVariants(HeroUIChip, {
  variants: {
    variant: {
      bordered: {
        base: styles.chip_bordered,
      },
    },
    size: {
      md: {
        base: styles.chip_md,
        content: styles.chip__content,
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
    radius: 'sm',
  },
});
