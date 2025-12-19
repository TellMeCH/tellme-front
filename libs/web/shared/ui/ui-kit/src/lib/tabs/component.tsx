'use client';

import { Tabs as HeroUITabs, extendVariants } from '@heroui/react';
import styles from './component.module.scss';

export const Tabs = extendVariants(HeroUITabs, {
  variants: {
    variant: {
      solid: {
        tabList: styles.tabs__list_solid,
        cursor: styles.tabs__cursor_solid,
      },
    },
    color: {
      default: {
        tabList: styles.tabs__list_default,
      },
    },
    size: {
      md: {
        tab: styles.tabs__item_md,
      },
    },
    radius: {
      sm: {
        tabList: styles.tabs__list_radius_sm,
        cursor: styles.tabs__cursor_radius_sm,
      },
    },
  },
  defaultVariants: {
    variant: 'solid',
    color: 'default',
    size: 'md',
    radius: 'sm',
  },
});
