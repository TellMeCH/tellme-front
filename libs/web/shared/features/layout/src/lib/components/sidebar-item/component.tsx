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
      href?: null;
      onPress: () => void;
    }
);

export function SidebarItem({ href, onPress, iconName, title, className }: SidebarItemProps): ReactElement {
  const pathname = usePathname();
  const labelRef = useRef<HTMLLabelElement>(null);
  const isActive = !!href && pathname.startsWith(href);

  const basePressableClass = 'absolute inset-0 z-10';
  const baseClass = 'flex items-center relative rounded-xl cursor-pointer py-3 px-8 my-1 transition-colors';
  const activeClass = 'bg-background-primary font-bold';
  const hoverClass = 'hover:bg-background-primary';

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
        className={basePressableClass} />}
      {onPress && <button
        onClick={handlePress}
        type='button'
        className={basePressableClass} />}
    </div>
  );
}
