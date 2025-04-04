import { times } from 'lodash';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading } from '@tellme/landing/shared/ui/ui-kit';
import TopicChartImage from '../../assets/app-topic-chart.png';
import CallCenterImage from '../../assets/call-center.png';
import MarkerImage from '../../assets/marker-highlighting-text.png';
import { HomeSectionId } from '../../enums';
import { Benefit } from '../benefit';

const images = [TopicChartImage, MarkerImage, CallCenterImage];

export function Benefits(): ReactElement {
  const t = useTranslations('landing-shared.HOME');

  return (
    <section className='section' id={HomeSectionId.ADDED_BENEFITS}>
      <div className='container'>
        <Heading level={2} className='text-center mb-[3.75rem] max-lg:mb-10'>
          {t('TEXT_ADDED_BENEFITS')}
        </Heading>
        <div className='flex flex-col gap-[100px] max-lg:gap-10'>
          {times(3).map((index) => (
            <Benefit
              key={`benefit-${index}`}
              title={t(`TEXT_BENEFIT_${index + 1}_TITLE`)}
              description={t(`TEXT_BENEFIT_${index + 1}_DESCRIPTION`)}
              imageSrc={images[index]}
              imageAlt={t(`TEXT_BENEFIT_${index + 1}_ALT`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
