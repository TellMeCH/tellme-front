import clsx from 'clsx';
import { FormMessage } from '../form-message/component';
import type { PropsWithChildren, ReactElement } from 'react';

export interface FormGroupProps extends PropsWithChildren {
  errorMessage?: string;
  errorID?: string;
  className?: string;
}

export function FormGroup({ children, errorMessage, errorID, className }: FormGroupProps): ReactElement {
  return (
    <div className={clsx('form__group', className)}>
      {children}
      {!!errorMessage && <FormMessage message={errorMessage} id={errorID} />}
    </div>
  );
}
