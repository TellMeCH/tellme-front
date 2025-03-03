import { PropsWithChildren, ReactElement } from 'react';
import { MainLayout as Layout } from '@tellme/web/topic/features/main-layout';

export default function MainLayout({ children }: PropsWithChildren): ReactElement {
  return <Layout>{children}</Layout>;
}
