import { ReactElement, ReactNode } from 'react';
import styles from './component.module.scss';
import { Sidebar } from './components/sidebar/component';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps): ReactElement {
  // TODO: Implement component
  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.layout__main}>{children}</main>
    </div>
  );
}
