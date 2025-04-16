import { ReactElement, ReactNode } from 'react';

interface ToastContentProps {
  title: string;
  description: ReactNode;
}

export function ToastContent({ title, description }: ToastContentProps): ReactElement {
  return (
    <div>
      <p className='mb-1'>
        <strong>{title}</strong>
      </p>
      <p>{description}</p>
    </div>
  );
}
