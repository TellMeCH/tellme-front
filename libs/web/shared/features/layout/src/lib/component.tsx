import { PropsWithChildren, ReactElement } from 'react';
import { Sidebar } from './components/sidebar/component';

interface LayoutProps extends PropsWithChildren {
  onLogoutSuccess: () => void;
}

export function Layout({ children, onLogoutSuccess }: LayoutProps): ReactElement {
  return (
    <div className='flex flex-row h-screen'>
      <Sidebar onLogoutSuccess={onLogoutSuccess} />
      <main className='flex-1 overflow-x-hidden overflow-y-auto p-4'>{children}</main>
    </div>
  );
}
