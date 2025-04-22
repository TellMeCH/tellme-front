import clsx from 'clsx';
import { ReactElement } from 'react';

interface FormMessageProps {
  message: string;
  id?: string;
  className?: string;
}

export function FormMessage({ message, id, className }: FormMessageProps): ReactElement {
  return (
    <div className={clsx('form__group__message', className)} id={id}>
      {message}
    </div>
  );
}
