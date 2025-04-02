import { ReactElement } from 'react';
import { Header, Hero, Process, Products } from './components';

export function Home(): ReactElement {
  return (
    <main>
      <Header />
      <Hero />
      <Process />
      <Products />
    </main>
  );
}
