'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { Fragment, type ReactElement } from 'react';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';
import { SidebarItems, type SidebarItemsProps } from '../sidebar-items/component';
import styles from './component.module.scss';
import { sidebarConfig } from './config';

export interface SidebarProps {
  className?: string;
}

//TODO: Add logout function
export function Sidebar({ className }: SidebarProps): ReactElement {
  // const t = useTranslations('account.SIDEBAR');
  const router = useRouter();

  const topItems: SidebarItemsProps['items'] = [
    {
      href: navigationConfig.routes.private.dashboard,
      iconName: 'menu',
      title: 'Dashboard',
    },
    {
      href: navigationConfig.routes.private.topicAnalysis,
      iconName: 'chart',
      title: 'Topic Analysis',
    },
    {
      href: navigationConfig.routes.private.topics,
      iconName: 'label',
      title: 'Topics',
    },
  ];

  return (
    <Fragment>
      <input
        id={sidebarConfig.toggleId}
        type='checkbox'
        className={styles.sidebarcheckbox} />
      <div className={clsx(styles.sidebar, className)}>
        <div className={styles.sidebar__inner}>
          <SidebarItems items={topItems} />
          {/*<SidebarItem iconName='logout' title={t('BUTTON_LOG_OUT')} className='mt-auto' />*/}
        </div>
      </div>
    </Fragment>
  );
}
