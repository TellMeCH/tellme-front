'use client';

import { Checkbox as NextUICheckbox, extendVariants } from '@heroui/react';
import styles from './component.module.scss';

export const Checkbox = extendVariants(NextUICheckbox, {
  variants: {
    size: {
      md: {
        base: styles.checkbox,
        wrapper: styles.checkbox_wrapper,
        icon: styles.checkbox_icon,
        label: styles.checkbox_label,
      },
    },
  },
  defaultVariants: {
    color: 'primary',
    size: 'md',
  },
});
