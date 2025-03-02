import clsx from 'clsx';
import { SidebarItem, type SidebarItemProps } from '../sidebar-item/component';
import type { ReactElement } from 'react';

export interface SidebarItemsProps {
  items: Array<SidebarItemProps>;
  className?: string;
}

export function SidebarItems({ items, className }: SidebarItemsProps): ReactElement {
  return (
    <div className={clsx('flex flex-col', className)}>
      {items.map((item) => (
        <SidebarItem key={item.title} {...item} />
      ))}
    </div>
  );
}
