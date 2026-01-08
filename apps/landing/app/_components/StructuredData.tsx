import { ReactElement } from 'react';

export const StructuredData = (): ReactElement => (
  <script
    type='application/ld+json'
    dangerouslySetInnerHTML={{
      __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: 'tellme',
        applicationCategory: 'BusinessApplication',
        description:
          'We transcribe and analyze your call recordings with AI to provide actionable insights that will boost your understanding of your customers and your call center operations.',
        url: 'https://tell-me.ch',
        offers: { '@type': 'Offer', price: 'Contact', priceCurrency: 'USD' },
      }),
    }}
  />
);
