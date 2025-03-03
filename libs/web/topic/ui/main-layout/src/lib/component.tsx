import { ReactElement, ReactNode } from 'react';
import { Sidebar } from './components/sidebar/component';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps): ReactElement {
  return (
    <div className='flex flex-row min-h-screen'>
      <Sidebar />
      <main className='flex-1 overflow-hidden p-4'>{children}</main>
    </div>
  );
}
