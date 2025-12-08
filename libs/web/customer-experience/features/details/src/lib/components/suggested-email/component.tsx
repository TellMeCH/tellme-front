import { useTranslations } from 'next-intl';
import { Fragment, ReactElement } from 'react';
import { Button, Icon } from '@tellme/shared/ui/ui-kit';
import { CustomerSummary } from '@tellme/web/shared/data-access/api';
import { Heading, Spinner } from '@tellme/web/shared/ui/ui-kit';

interface SuggestedEmailProps {
  summary?: CustomerSummary;
}

const customerCommonEmail = 'your_customer@wherever.com';

export function SuggestedEmail({ summary }: SuggestedEmailProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS.SUGGESTED_EMAIL');
  const emailLink = `mailto:${customerCommonEmail}?subject=${summary?.suggestedEmailSubject}&body=${summary?.suggestedEmailBody}`;

  return (
    <div className='bg-background-secondary rounded-2xl py-6 px-8'>
      <Heading level={2} className='text-base mb-6'>
        {t('TEXT_TITLE')}
      </Heading>
      {summary ? (
        <Fragment>
          <p className='mb-3 text-text-secondary'>{summary.suggestedEmailSubject}</p>
          <pre className='max-w-[900px] mb-6'>{summary.suggestedEmailBody}</pre>
          <Button
            as='a'
            href={emailLink}
            variant='bordered'
            startContent={<Icon name='email' theme='brand_primary' />}>
            {t('BUTTON_SEND_EMAIL')}
          </Button>
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
