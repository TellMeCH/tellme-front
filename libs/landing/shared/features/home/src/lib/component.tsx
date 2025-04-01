import { Fragment, ReactElement } from 'react';
import { Hero, Process } from './components';

export function Home(): ReactElement {
  return (
    <Fragment>
      <Hero />
      <Process />
    </Fragment>
  );
}
