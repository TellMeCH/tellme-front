import { ReactElement } from 'react';

interface OrganizationDetailProps {
  name: string;
  value: number;
}

export function OrganizationDetail({ name, value }: OrganizationDetailProps): ReactElement {
  return (
    <div className='rounded-2xl bg-background-secondary px-8 py-6 flex-1'>
      <p className='text-xs uppercase mb-8'>{name}</p>
      <p className='text-3xl'>{value}</p>
    </div>
  );
}
