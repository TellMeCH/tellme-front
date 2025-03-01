import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactElement, useRef } from 'react';
import { Icon, type IconProps } from '@tellme/web/shared/ui/ui-kit';
import { sidebarConfig } from '../sidebar/config';

export type SidebarItemProps = {
  iconName: IconProps['name'];
  title: string;
  count?: number;
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

export function SidebarItem({ href, onPress, iconName, title, count, className }: SidebarItemProps): ReactElement {
  const pathname = usePathname();
  const labelRef = useRef<HTMLLabelElement>(null);
  const commonPressableClassName = 'absolute inset-0 z-10';
  const commonHoverClassName = 'group-hover:bg-brand-secondary transition-colors';

  const handlePress = (): void => {
    if (!href && onPress) {
      onPress();
    }

    if (labelRef.current && getComputedStyle(labelRef.current).display !== 'none') {
      labelRef.current.click();
    }
  };

  return (
    <div
      className={clsx(
        'flex items-center py-3 px-4 gap-x-4 rounded-2xl relative lg:px-3 transition-colors',
        !!href && pathname.startsWith(href) ? 'bg-background-secondary' : 'group hover:text-brand-secondary',
        className,
      )}>
      <Icon
        name={iconName}
        theme='primary'
        className={commonHoverClassName} />
      <span className='text-[17px] lg:text-lg'>{title}</span>
      {/*count && (
        <Tag
          size='md'
          classNames={{
            base: clsx('ml-auto px-1 h-[26px]', commonHoverClassName),
            content: 'text-sm',
          }}>
          {count}
        </Tag>
      )*/}
      {!!href && <Link
        href={href}
        onClick={handlePress}
        className={commonPressableClassName} />}
      {onPress && <button
        onClick={handlePress}
        type='button'
        className={commonPressableClassName} />}
      <label
        ref={labelRef}
        htmlFor={sidebarConfig.toggleId}
        className='invisible lg:hidden' />
    </div>
  );
}
