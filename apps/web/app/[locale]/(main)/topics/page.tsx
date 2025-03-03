import { ReactElement } from 'react';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { UnderConstruction } from '@tellme/web/shared/ui/under-construction';

export default function TopicsPage(): ReactElement {
  return (
    <div className='min-h-screen'>
      <Heading level={1} className='text-center'>
        Topics
      </Heading>
      <UnderConstruction />
    </div>
  );
}
