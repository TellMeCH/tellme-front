import { useTranslations } from 'next-intl';
import { Fragment, ReactElement } from 'react';
import { Customer, CustomerSummary } from '@tellme/web/shared/data-access/api';
import { Heading, Spinner } from '@tellme/web/shared/ui/ui-kit';
import { DateTimeFormat, formatDate } from '@tellme/web/shared/utils/dates';
import { formatCurrency } from '@tellme/web/shared/utils/strings';

interface CustomerInfoProps {
  customer: Customer;
  summary?: CustomerSummary;
}

const keyClassName = 'text-sm text-text-secondary mb-1';

export function CustomerInfo({ customer, summary }: CustomerInfoProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS.CUSTOMER_INFO');

  return (
    <div className='bg-background-secondary rounded-2xl py-6 px-8'>
      <Heading level={2} className='text-base mb-4'>
        {t('TEXT_TITLE')}
      </Heading>

      <div className='flex mb-6 gap-6'>
        <div className='basis-1/4'>
          <div className={keyClassName}>{t('TEXT_NAME')}</div>
          <div>{customer.fullName}</div>
        </div>
        <div className='basis-1/4'>
          <div className={keyClassName}>{t('TEXT_EARLIEST_CONVERSATION')}</div>
          <div>{formatDate(customer.firstConversationDate, DateTimeFormat.DAY_NUMBER_MONTH_YEAR)}</div>
        </div>
        <div className='basis-1/4'>
          <div className={keyClassName}>{t('TEXT_CALLS_OVERALL')}</div>
          <div>{customer.conversationsCount}</div>
        </div>
        <div className='basis-1/4'>
          <div className={keyClassName}>{t('TEXT_REVENUE')}</div>
          <div>{customer.totalRevenue === null ? '-' : formatCurrency(Math.round(customer.totalRevenue))}</div>
        </div>
      </div>

      {summary ? (
        <Fragment>
          <div className='rounded-2xl bg-background-tertiary p-4 flex mb-4 gap-6'>
            <div className='basis-1/2'>
              <Heading level={3} className='text-sm mb-1'>
                {t('TEXT_EXPECTATIONS_MET')}
              </Heading>
              <p className='whitespace-pre-wrap'>{summary.expectationsMet}</p>
            </div>
            <div className='basis-1/2'>
              <Heading level={3} className='text-sm mb-1'>
                {t('TEXT_IMPROVEMENT_SUGGESTIONS')}
              </Heading>
              <p className='whitespace-pre-wrap'>{summary.improvementSuggestions}</p>
            </div>
          </div>

          <div className='flex gap-6'>
            <div className='basis-1/2'>
              <div className={keyClassName}>{t('TEXT_LIKED_FEATURES')}</div>
              <p className='whitespace-pre-wrap'>{summary.likedFeatures}</p>
            </div>
            <div className='basis-1/2'>
              <div className={keyClassName}>{t('TEXT_DISLIKED_FEATURES')}</div>
              <p className='whitespace-pre-wrap'>{summary.dislikedFeatures}</p>
            </div>
          </div>
        </Fragment>
      ) : (
        <div className='flex gap-4 items-center'>
          <Spinner size='sm' color='default' />
          <p className='text-text-secondary'>{t('TEXT_GENERATING')}</p>
        </div>
      )}
    </div>
  );
}
