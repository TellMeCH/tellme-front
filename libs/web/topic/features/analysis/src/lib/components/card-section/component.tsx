import { type ReactElement, ReactNode } from 'react';
import { Heading } from '@tellme/web/shared/ui/ui-kit';

interface CardSectionProps {
  title: string;
  children: ReactNode;
}

export function CardSection({ title, children }: CardSectionProps): ReactElement {
  return (
    <div className='flex flex-col gap-3 p-5 bg-background-primary rounded-lg'>
      <Heading level={3} className='text-xl'>
        {title}
      </Heading>
      {children}
    </div>
  );
}
