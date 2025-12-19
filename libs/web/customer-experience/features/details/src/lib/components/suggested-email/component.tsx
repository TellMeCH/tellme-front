import { useTranslations } from 'next-intl';
import { Fragment, ReactElement } from 'react';
import { Button, Icon } from '@tellme/shared/ui/ui-kit';
import { CustomerSummary } from '@tellme/web/shared/data-access/api';
import { Heading, Spinner } from '@tellme/web/shared/ui/ui-kit';

interface SuggestedEmailProps {
  summary?: CustomerSummary;
}

export function SuggestedEmail({ summary }: SuggestedEmailProps): ReactElement {
  const t = useTranslations('customer-experience.DETAILS.SUGGESTED_EMAIL');

  return (
    <article className='pt-2'>
      <Heading level={2} className='text-base mb-6'>
        {t('TEXT_TITLE')}
      </Heading>
      {summary ? (
        <Fragment>
          {/* Suggested Email Subject */}
          <p className='mb-3 text-text-secondary'>{summary.suggestedEmailSubject}</p>
          {/* Suggested Email Body */}
          <p className='max-w-[900px] mb-6 whitespace-pre-wrap'>{summary.suggestedEmailBody}</p>
          <Button
            as='a'
            href={summary.suggestedEmailLink}
            target='_blank'
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
    </article>
  );
}
