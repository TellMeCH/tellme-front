import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { ReactElement } from 'react';
import { Heading } from '@tellme/landing/shared/ui/ui-kit';

interface BenefitProps {
  title: string;
  description: string;
  imageSrc: string | StaticImport;
  imageAlt: string;
}

export function Benefit({ title, description, imageAlt, imageSrc }: BenefitProps): ReactElement {
  return (
    <article className='flex items-center justify-between md:even:flex-row-reverse max-md:flex-col max-md:gap-6'>
      <div className='max-w-[478px] max-lg:max-w-[385px] max-md:max-w-none'>
        <Heading level={3} className='max-w-[390px] mb-8 max-lg:mb-4 max-md:max-w-none'>
          {title}
        </Heading>
        <p>{description}</p>
      </div>
      <div className='relative w-[48%] aspect-[1.69] max-lg:w-[44%] max-md:w-full'>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className='object-cover rounded-lg' />
      </div>
    </article>
  );
}
