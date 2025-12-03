import clsx from 'clsx';
import { type ReactElement, ReactNode } from 'react';
import { Heading } from '../heading/component';
import styles from './component.module.scss';

interface HeaderProps {
  title: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  titleClassName?: string;
  titleTestId?: string;
}

export function Header({ title, leftContent, rightContent, titleClassName, titleTestId }: HeaderProps): ReactElement {
  return (
    <header className='flex justify-between items-center bg-background-secondary rounded-2xl py-4 px-8'>
      <div className='flex items-center gap-3'>
        {leftContent}
        <Heading testId={titleTestId} className={clsx(styles.header__title, titleClassName)}>
          {title}
        </Heading>
      </div>
      {rightContent}
    </header>
  );
}
