import clsx from 'clsx';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import EmptyChartSVG from './assets/empty-chart.svg';

interface EmptyChartProps {
  title?: string;
  subtitle?: string;
  containerClassName?: string;
}

export function EmptyChart({ title, subtitle, containerClassName }: EmptyChartProps): ReactElement {
  const t = useTranslations('topic.EMPTY_CHART');

  return (
    <div className={clsx('flex flex-1 justify-center items-center flex-col gap-6', containerClassName)}>
      <Image src={EmptyChartSVG} alt={t('TEXT_ALT_EMPTY_CHART')} />
      <div className='flex flex-col items-center gap-3 max-w-[322px]'>
        <Heading level={3} className='text-lg'>
          {title || t('TEXT_TITLE')}
        </Heading>
        <p className='text-center'>{subtitle || t('TEXT_SUBTITLE')}</p>
      </div>
    </div>
  );
}
