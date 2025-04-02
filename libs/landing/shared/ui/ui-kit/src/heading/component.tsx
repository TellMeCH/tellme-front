import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import styles from './component.module.scss';

interface HeadingProps extends PropsWithChildren {
  level?: 1 | 2 | 3;
  className?: string;
}

export const Heading: React.FC<HeadingProps> = ({ level = 1, className, children }) => {
  const Component = `h${level}` as keyof React.JSX.IntrinsicElements;

  return <Component className={clsx(styles.heading, styles[`heading_${level}`], className)}>{children}</Component>;
};
