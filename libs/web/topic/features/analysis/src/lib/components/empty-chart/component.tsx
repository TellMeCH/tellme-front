import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { type ReactElement } from 'react';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import EmptyChartSVG from '../../assets/empty-chart.svg';

interface EmptyChartProps {
  title?: string;
  subtitle?: string;
}

export function EmptyChart({ title, subtitle }: EmptyChartProps): ReactElement {
  const t = useTranslations('web-shared.UI_KIT.LOGO');

  return (
    <div className='flex flex-col gap-3 p-5 bg-background-primary rounded-lg'>
      <Image src={EmptyChartSVG} alt={t('TEXT_ALT_LOGO')} />
      <Heading level={3} className='text-xl'>
        {title && title}
      </Heading>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
