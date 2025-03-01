import { SidebarItem, type SidebarItemProps } from '../sidebar-item/component';
import type { ReactElement } from 'react';

export interface SidebarItemsProps {
  items: Array<SidebarItemProps>;
}

export function SidebarItems({ items }: SidebarItemsProps): ReactElement {
  return (
    <div className='flex flex-col lg:gap-y-1'>
      {items.map((item) => (
        <SidebarItem key={item.title} {...item} />
      ))}
    </div>
  );
}
