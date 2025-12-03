'use client';

import { Spinner as HeroUISpinner, extendVariants } from '@heroui/react';
import styles from './component.module.scss';

export const Spinner = extendVariants(HeroUISpinner, {
  variants: {
    size: {
      md: {
        wrapper: styles.spinner_md,
      },
      sm: {
        wrapper: styles.spinner_sm,
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});
