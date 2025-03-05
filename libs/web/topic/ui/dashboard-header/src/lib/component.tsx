import { DateTime } from 'luxon';
import { type ReactElement } from 'react';
import { Heading, Icon } from '@tellme/web/shared/ui/ui-kit';
import { formatDateRange } from '@tellme/web/shared/utils/dates';
import styles from './component.module.scss';

interface DashboardHeaderProps {
  organisationName: string;
  firstDate: DateTime;
  secondDate: DateTime;
}

export function DashboardHeader({ organisationName, firstDate, secondDate }: DashboardHeaderProps): ReactElement {
  return (
    <div className='flex flex-row justify-between items-center bg-background-secondary rounded-2xl py-4 px-8'>
      <Heading className={styles.header__title}>{organisationName}</Heading>
      <div className='flex flex-row items-center gap-4'>
        <p className='underline'>{formatDateRange(firstDate, secondDate)}</p>
        <Icon name='calendar' />
      </div>
    </div>
  );
}
