import { type ReactElement } from 'react';
import { Heading, Icon } from '@tellme/web/shared/ui/ui-kit';
import { formatDate, DateTimeFormat } from '@tellme/web/shared/utils/dates';
import { statisticsMock } from '../../mocks/statistics';

// TODO: Possibly move to topic/ui
export function DashboardHeader(): ReactElement {
  const { organisationName, firstDate, secondDate } = statisticsMock;

  return (
    <div className='flex flex-row justify-between items-center bg-background-secondary rounded-2xl py-4 px-8'>
      <Heading className='uppercase' level={3}>
        {organisationName}
      </Heading>
      <div className='flex flex-row items-center gap-4'>
        <p className='underline'>{`${formatDate(firstDate, DateTimeFormat.MONTH_ONLY)}-${formatDate(secondDate, DateTimeFormat.MONTH_YEAR)}`}</p>
        <Icon name='calendar' />
      </div>
    </div>
  );
}
