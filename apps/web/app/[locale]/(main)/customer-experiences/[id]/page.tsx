'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ReactElement } from 'react';
import { CustomerExperienceDetails } from '@tellme/web/customer-experience/features/details';

export default function CustomerExperienceDetailsPage(): ReactElement {
  const searchParams = useSearchParams();
  const pathParams = useParams<{ id: string }>();

  return (
    <CustomerExperienceDetails id={Number(pathParams.id)} conversationId={Number(searchParams.get('conversationId'))} />
  );
}
