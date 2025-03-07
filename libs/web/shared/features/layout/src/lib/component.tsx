import { ReactElement, ReactNode } from 'react';
import { Sidebar } from './components/sidebar/component';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps): ReactElement {
  return (
    <div className='flex flex-row h-screen'>
      <Sidebar />
      <main className='flex-1 overflow-x-hidden overflow-y-auto p-4'>{children}</main>
    </div>
  );
}
