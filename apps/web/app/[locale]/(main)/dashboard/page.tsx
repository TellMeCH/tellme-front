import { ReactElement } from 'react';
import { Heading } from '@tellme/web/shared/ui/ui-kit';

export default function DashboardPage(): ReactElement {
  return (
    <div className='min-h-screen'>
      <Heading level={1} className='text-center'>
        Dashboard
      </Heading>
    </div>
  );
}
