'use client';

import { Fragment, ReactElement } from 'react';
import { SummaryDetail } from '@tellme/web/shared/data-access/api';
import { CardSection } from '../card-section';

interface TopicSummaryProps {
  summary: Array<SummaryDetail>;
}

export function TopicSummary({ summary }: TopicSummaryProps): ReactElement {
  const specialSections = ['reasonsForCalling', 'suggestedActions'];
  const highlighted = summary?.filter((item) => specialSections.includes(item.key));
  const general = summary?.filter((item) => !specialSections.includes(item.key));

  return (
    <Fragment>
      {highlighted.map(({ key, name, description }) => (
        <CardSection key={key} title={name}>
          <p>{description}</p>
        </CardSection>
      ))}

      <div className='grid grid-cols-2 gap-10 rounded-lg mt-2'>
        {general.map(({ key, name, description }) => (
          <div key={key}>
            <p className='font-medium text-xl mb-2'>{name}</p>
            <p className='text-gray-600 whitespace-normal text-clip'>{description}</p>
          </div>
        ))}
      </div>
    </Fragment>
  );
}
