import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Button } from '@tellme/shared/ui/ui-kit';
import { Customer } from '@tellme/web/shared/data-access/api';
import { appConstants } from '@tellme/web/shared/utils/constants';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { navigationConfig } from '@tellme/web/shared/utils/navigation';
import { formatCurrency } from '@tellme/web/shared/utils/strings';

interface ItemProps {
  customer: Customer;
}

const columnTitleClassName = 'text-text-secondary mb-2';

export function Item({ customer }: ItemProps): ReactElement {
  const t = useTranslations('customer-experience.LIST.ITEM');

  return (
    <div className='flex py-4 border-b border-b-text-tertiary text-sm items-start gap-6' data-testid='customer-item'>
      <div className='basis-[13%]'>
        <div className={columnTitleClassName}>{t('TEXT_DATE')}</div>
        <div>{formatDate(customer.lastConversationDate, DateTimeFormat.DAY_NUMBER_MONTH_YEAR)}</div>
      </div>
      <div className='basis-[16%]'>
        <div className={columnTitleClassName}>{t('TEXT_CUSTOMER_NAME')}</div>
        <div>{customer.fullName}</div>
      </div>
      <div className='basis-[25%]'>
        <div className={columnTitleClassName}>{t('TEXT_CONVERSATION_TITLE')}</div>
        <div>{customer.latestConversationTitle}</div>
      </div>
      <div className='basis-[17%]'>
        <div className={columnTitleClassName}>{t('TEXT_CUSTOMER_ENGAGEMENT')}</div>
        <div>
          {customer.averageSentiment.toFixed(2)}
          <span className='text-text-secondary'>/{appConstants.maxCustomerEngagement.toFixed(2)}</span>
        </div>
      </div>
      <div className='basis-[14%]'>
        <div className={columnTitleClassName}>{t('TEXT_REVENUE')}</div>
        <div>{formatCurrency(Math.round(customer.totalRevenue))}</div>
      </div>
      <div className='basis-[15%] flex justify-end'>
        <Button
          as={Link}
          href={navigationConfig.routes.private.customerExperiences.view(customer.idFromUrl)}
          isDisabled={!customer.conversationsCount}
          variant='bordered'>
          {t('BUTTON_VIEW_DETAILS')}
        </Button>
      </div>
    </div>
  );
}
