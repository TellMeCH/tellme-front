import { ReactElement } from 'react';
import { Benefits, Header, Hero, Process, Products } from './components';

export function Home(): ReactElement {
  return (
    <main>
      <Header />
      <Hero />
      <Process />
      <Products />
      <Benefits />
    </main>
  );
}
