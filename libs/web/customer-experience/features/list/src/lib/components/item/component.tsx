import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Button } from '@tellme/shared/ui/ui-kit';
import { Customer } from '@tellme/web/shared/data-access/api';
import { appConstants } from '@tellme/web/shared/utils/constants';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';

interface ItemProps {
  customer: Customer;
}

const columnTitleClassName = 'text-secondary mb-2';

export function Item({ customer }: ItemProps): ReactElement {
  const t = useTranslations('customer-experience.LIST.ITEM');

  return (
    <div className='flex py-4 border border-b-text-tertiary text-sm'>
      <div>
        <div className={columnTitleClassName}>{t('TEXT_DATE')}</div>
        <div>{formatDate(customer.lastConversationDate, DateTimeFormat.DAY_NUMBER_MONTH_YEAR)}</div>
      </div>
      <div>
        <div className={columnTitleClassName}>{t('TEXT_CUSTOMER_NAME')}</div>
        <div>{customer.fullName}</div>
      </div>
      <div>
        <div className={columnTitleClassName}>{t('TEXT_TITLE')}</div>
        <div>{customer.latestConversationTitle}</div>
      </div>
      <div>
        <div className={columnTitleClassName}>{t('TEXT_CUSTOMER_ENGAGEMENT')}</div>
        <div>
          {customer.averageSentiment.toFixed(1)}/{appConstants.maxCustomerEngagement.toFixed(1)}
        </div>
      </div>
      <div>
        <div className={columnTitleClassName}>{t('TEXT_REVENUE')}</div>
        <div>
          {customer.totalRevenue} {appConstants.currencyCode}
        </div>
      </div>
      <Button
        as={Link}
        href={navigationConfig.routes.private.customerExperiences.view(customer.idFromUrl)}
        variant='bordered'>
        {t('BUTTON_VIEW_DETAILS')}
      </Button>
    </div>
  );
}
