import { ReactElement } from 'react';
import { CustomerExperienceDetails } from '@tellme/web/customer-experience/features/details';

interface CustomerExperienceDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerExperienceDetailsPage({
  params,
}: CustomerExperienceDetailsPageProps): Promise<ReactElement> {
  const { id } = await params;

  return <CustomerExperienceDetails id={Number(id)} />;
}
