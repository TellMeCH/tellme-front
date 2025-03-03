import { PropsWithChildren, ReactElement } from 'react';
import { Layout } from '@tellme/web/shared/features/layout';

export default function MainLayout({ children }: PropsWithChildren): ReactElement {
  return <Layout>{children}</Layout>;
}
