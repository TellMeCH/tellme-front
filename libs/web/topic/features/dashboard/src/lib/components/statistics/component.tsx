import { Fragment, type ReactElement } from 'react';
import { Heading, Icon } from '@tellme/web/shared/ui/ui-kit';
import { formatDate, DateTimeFormat } from '@tellme/web/shared/utils/dates';
import { statisticsMock } from '../../mocks/statistics';

export function DashboardStatistics(): ReactElement {
  const { organisationName, firstDate, secondDate } = statisticsMock;

  return (
    <Fragment>
      <div className='flex flex-row justify-between items-center bg-background-secondary rounded-2xl py-4 px-8'>
        <Heading level={3}>{organisationName.toUpperCase()}</Heading>
        <div className='flex flex-row items-center gap-4'>
          <p className='underline'>{`${formatDate(firstDate, DateTimeFormat.MONTH_ONLY)}-${formatDate(secondDate, DateTimeFormat.MONTH_YEAR)}`}</p>
          <Icon name='calendar' />
        </div>
      </div>
      <div />
    </Fragment>
  );
}
