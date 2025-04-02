import { Fragment, ReactElement } from 'react';
import { Header, Hero, Process } from './components';

export function Home(): ReactElement {
  return (
    <Fragment>
      <Header />
      <Hero />
      <Process />
    </Fragment>
  );
}
