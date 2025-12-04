'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { ReactElement, Suspense } from 'react';
import { CustomerExperienceDetails } from '@tellme/web/customer-experience/features/details';

function CustomerExperienceDetailsWithParams(): ReactElement {
  const searchParams = useSearchParams();
  const pathParams = useParams<{ id: string }>();

  return (
    <CustomerExperienceDetails id={Number(pathParams.id)} conversationId={Number(searchParams.get('conversationId'))} />
  );
}

export default async function CustomerExperienceDetailsPage(): Promise<ReactElement> {
  return (
    <Suspense>
      <CustomerExperienceDetailsWithParams />
    </Suspense>
  );
}
