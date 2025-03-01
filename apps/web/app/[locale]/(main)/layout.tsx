import { PropsWithChildren, ReactElement } from 'react';
import { MainLayout as Layout } from '@tellme/web/topic/ui/main-layout';

export default function MainLayout({ children }: PropsWithChildren): ReactElement {
  return <Layout>{children}</Layout>;
}
