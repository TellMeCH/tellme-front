import clsx from 'clsx';
import { type ReactElement, ReactNode } from 'react';
import { Heading } from '../heading/component';
import styles from './component.module.scss';

interface HeaderProps {
  title: string;
  rightContent?: ReactNode;
  titleClassName?: string;
  titleTestId?: string;
}

export function Header({ title, rightContent, titleClassName, titleTestId }: HeaderProps): ReactElement {
  return (
    <div className='flex flex-row justify-between items-center bg-background-secondary rounded-2xl py-4 px-8'>
      <Heading testId={titleTestId} className={clsx(styles.header__title, titleClassName)}>
        {title}
      </Heading>
      {rightContent}
    </div>
  );
}
