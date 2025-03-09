'use client';

import { Autocomplete, AutocompleteItem } from '@heroui/react';
import { type ReactElement } from 'react';
import { Header, Heading } from '@tellme/web/shared/ui/ui-kit';

export const animals = [
  { label: 'Cat', key: 'cat', description: 'The second most popular pet in the world' },
  { label: 'Dog', key: 'dog', description: 'The most popular pet in the world' },
  { label: 'Elephant', key: 'elephant', description: 'The largest land animal' },
  { label: 'Lion', key: 'lion', description: 'The king of the jungle' },
  { label: 'Tiger', key: 'tiger', description: 'The largest cat species' },
  { label: 'Giraffe', key: 'giraffe', description: 'The tallest land animal' },
];

export function TopicAnalysis(): ReactElement {
  return (
    <div className='min-h-full flex flex-col gap-2'>
      <Header title={'Topic Analysis'} />
      <div className='flex flex-col flex-1 bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
        <Heading level={2} className=' text-3xl'>
          {'Sizing and fit'}
        </Heading>
        <Autocomplete
          className='max-w-xs'
          defaultItems={animals}
          placeholder='Search an animal'>
          {(item) => <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>}
        </Autocomplete>
      </div>
    </div>
  );
}
