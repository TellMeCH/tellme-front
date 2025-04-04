import { ReactElement } from 'react';
import { AboutUs, Benefits, Footer, Header, Hero, Process, Products } from './components';

export function Home(): ReactElement {
  return (
    <main>
      <Header />
      <Hero />
      <Process />
      <Products />
      <Benefits />
      <AboutUs />
      <Footer />
    </main>
  );
}
