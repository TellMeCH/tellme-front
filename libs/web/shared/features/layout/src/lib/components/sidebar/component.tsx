'use client';

import { User } from '@heroui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { firebaseAuth } from '@tellme/web/shared/data-access/auth';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { Logo } from '@tellme/web/shared/ui/ui-kit';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';
import { SidebarItem } from '../sidebar-item/component';
import { SidebarItems, type SidebarItemsProps } from '../sidebar-items/component';

export interface SidebarProps {
  className?: string;
}

//TODO: Add logout function
export function Sidebar({ className }: SidebarProps): ReactElement {
  const t = useTranslations('web-shared.LAYOUT.SIDEBAR');
  const showUnderDevelopment = useShowUnderDevelopment();
  const email = firebaseAuth.currentUser?.email || '';

  const sidebarItems: SidebarItemsProps['itemsProps'] = [
    {
      href: navigationConfig.routes.private.dashboard,
      iconName: 'menu',
      title: t('LINK_DASHBOARD'),
    },
    {
      href: navigationConfig.routes.private.topicAnalysis,
      iconName: 'chart',
      title: t('LINK_TOPIC_ANALYSIS'),
    },
    {
      href: navigationConfig.routes.private.topics,
      iconName: 'label',
      title: t('LINK_TOPICS'),
    },
  ];

  return (
    <div
      className={clsx(
        'flex flex-col justify-between min-h-full w-full max-w-[260px] bg-background-secondary py-10 px-2',
        className,
      )}>
      <nav className='flex flex-col gap-16'>
        <Logo className='mx-8 flex-1' />
        <SidebarItems itemsProps={sidebarItems} />
      </nav>
      <div>
        <div className='flex flex-row gap-2 items-center px-7 mb-3 overflow-hidden text-ellipsis'>
          <User
            name={email}
            classNames={{
              name: 'text-base',
            }}
            avatarProps={{
              size: 'sm',
              name: email.charAt(0),
              classNames: {
                base: 'bg-background-primary',
                name: 'text-text-secondary uppercase text-xl font-bold',
              },
            }}
          />
        </div>
        <SidebarItem
          iconName='logout'
          title={t('BUTTON_LOGOUT')}
          onPress={showUnderDevelopment} />
      </div>
    </div>
  );
}
