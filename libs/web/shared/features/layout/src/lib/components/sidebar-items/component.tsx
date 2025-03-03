import clsx from 'clsx';
import { SidebarItem, type SidebarItemProps } from '../sidebar-item/component';
import type { ReactElement } from 'react';

export interface SidebarItemsProps {
  itemsProps: Array<SidebarItemProps>;
  className?: string;
}

export function SidebarItems({ itemsProps, className }: SidebarItemsProps): ReactElement {
  return (
    <div className={clsx('flex flex-col', className)}>
      {itemsProps.map((item) => (
        <SidebarItem key={item.title} {...item} />
      ))}
    </div>
  );
}
