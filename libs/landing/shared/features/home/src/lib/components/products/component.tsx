import { times } from 'lodash';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import { Heading } from '@tellme/landing/shared/ui/ui-kit';
import EntrepreneurImage from '../../assets/entrepreneur-with-charts.png';
import ExecutiveDirectorImage from '../../assets/executive-director.png';
import MeetingImage from '../../assets/meeting.png';
import { HomeSectionId } from '../../enums';
import { Product } from '../product';

const images = [ExecutiveDirectorImage, MeetingImage, EntrepreneurImage];

export function Products(): ReactElement {
  const t = useTranslations('landing-shared.HOME');

  return (
    <section className='section' id={HomeSectionId.OUR_PRODUCTS}>
      <div className='container'>
        <Heading level={2} className='mb-[3.75rem]'>
          {t('TEXT_OUR_PRODUCTS')}
        </Heading>
        <div className='flex gap-4 max-md:flex-col'>
          {times(3).map((index) => (
            <Product
              key={`product-${index}`}
              title={t(`TEXT_PRODUCT_${index + 1}_TITLE`)}
              description={t(`TEXT_PRODUCT_${index + 1}_DESCRIPTION`)}
              imageSrc={images[index]}
              imageAlt={t(`TEXT_PRODUCT_${index + 1}_ALT`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
