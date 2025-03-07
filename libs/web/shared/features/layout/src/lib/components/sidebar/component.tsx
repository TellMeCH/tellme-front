'use client';

import { Avatar } from '@heroui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { useShowUnderDevelopment } from '@tellme/web/shared/features/toast-service';
import { Logo } from '@tellme/web/shared/ui/ui-kit';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';
import { SidebarItem } from '../sidebar-item/component';
import { SidebarItems, type SidebarItemsProps } from '../sidebar-items/component';
import { userMock } from './mocks/user';

export interface SidebarProps {
  className?: string;
}

//TODO: Add logout function
export function Sidebar({ className }: SidebarProps): ReactElement {
  const t = useTranslations('web-shared.LAYOUT.SIDEBAR');
  const showUnderDevelopment = useShowUnderDevelopment();
  const { email, avatar } = userMock;

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
      <nav className='flex flex-col gap-16 '>
        <Logo className='mx-8 flex-1' />
        <SidebarItems itemsProps={sidebarItems} />
      </nav>
      <div className='sticky'>
        {/* TODO: Add real user data */}
        <div className='flex flex-row gap-2 items-center px-7 mb-3'>
          <Avatar
            size='sm'
            src={avatar.link}
            name={email.charAt(0).toUpperCase()} />
          <p className='px-1'>{email}</p>
        </div>
        <SidebarItem
          iconName='logout'
          title={t('BUTTON_LOGOUT')}
          onPress={showUnderDevelopment} />
      </div>
    </div>
  );
}
