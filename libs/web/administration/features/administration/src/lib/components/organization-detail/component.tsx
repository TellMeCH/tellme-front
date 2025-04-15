import { ReactElement } from 'react';

interface OrganizationDetailProps {
  name: string;
  value: number;
  valueTestId?: string;
}

export function OrganizationDetail({ name, value, valueTestId }: OrganizationDetailProps): ReactElement {
  return (
    <div className='rounded-2xl bg-background-secondary px-8 py-6 flex-1'>
      <p className='text-xs uppercase mb-8'>{name}</p>
      <p className='text-3xl' data-testid={valueTestId}>
        {value}
      </p>
    </div>
  );
}
