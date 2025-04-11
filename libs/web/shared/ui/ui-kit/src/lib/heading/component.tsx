import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import styles from './component.module.scss';

interface HeadingProps extends PropsWithChildren {
  level?: 1 | 2 | 3 | 4 | 5;
  className?: string;
  testId?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level = 1, className, testId, children }) => {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements;

  return (
    <Component data-testid={testId} className={clsx(styles.heading, styles[`heading_${level}`], className)}>
      {children}
    </Component>
  );
};
