import { times } from 'lodash';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading } from '@tellme/landing/shared/ui/ui-kit';
import { ProcessStep } from '../process-step';

export function Process(): ReactElement {
  const t = useTranslations('landing-shared.HOME');

  return (
    <section className='bg-background-secondary section'>
      <div className='container'>
        <Heading level={2} className='mb-[3.75rem] text-center'>
          {t('TEXT_PROCESS_TITLE')}
        </Heading>
        <ol className='flex justify-between max-lg:flex-col max-lg:gap-[120px] max-lg:items-center'>
          {times(3, (index) => (
            <ProcessStep
              key={`step-${index}`}
              number={index + 1}
              text={t(`TEXT_STEP_${index + 1}`)} />
          ))}
        </ol>
      </div>
    </section>
  );
}
