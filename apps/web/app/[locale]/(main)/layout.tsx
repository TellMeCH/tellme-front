import { PropsWithChildren, ReactElement } from 'react';
import { MainLayout as Layout } from '@tellme/web/shared/features/main-layout';

export default function MainLayout({ children }: PropsWithChildren): ReactElement {
  return <Layout>{children}</Layout>;
}
