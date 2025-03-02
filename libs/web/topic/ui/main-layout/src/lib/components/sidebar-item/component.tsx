import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactElement, useRef } from 'react';
import { Icon, type IconProps } from '@tellme/web/shared/ui/ui-kit';

export type SidebarItemProps = {
  iconName: IconProps['name'];
  title: string;
  className?: string;
} & (
  | {
      href: string;
      onPress?: null;
    }
  | {
      onPress: () => void;
      href?: null;
    }
);

export function SidebarItem({ href, onPress, iconName, title, className }: SidebarItemProps): ReactElement {
  const pathname = usePathname();
  const labelRef = useRef<HTMLLabelElement>(null);
  const isActive = !!href && pathname.startsWith(href);

  const baseClass = 'flex items-center relative rounded-md transition-colors  cursor-pointer';
  const activeClass = 'bg-brand-primary';
  const hoverClass = 'hover:bg-brand-secondary hover:text-brand-primary';

  const handlePress = (): void => {
    if (!href && onPress) {
      onPress();
    }

    if (labelRef.current && getComputedStyle(labelRef.current).display !== 'none') {
      labelRef.current.click();
    }
  };

  return (
    <div className={clsx(baseClass, isActive ? activeClass : hoverClass, className)}>
      <Icon name={iconName} />
      <span className='ml-3'>{title}</span>
      {!!href && <Link
        href={href}
        onClick={handlePress}
        className='absolute inset-0 z-10 w-max' />}
      {onPress && <button
        onClick={handlePress}
        type='button'
        className='absolute inset-0 z-10' />}
    </div>
  );
}
