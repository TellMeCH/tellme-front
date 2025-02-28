import { PropsWithChildren, ReactElement } from 'react';

export default function IndividualLayout({ children }: PropsWithChildren): ReactElement {
  return <div>{children}</div>;
}
