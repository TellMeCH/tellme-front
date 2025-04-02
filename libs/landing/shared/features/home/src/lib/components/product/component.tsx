import Image from 'next/image';
import { ReactElement } from 'react';

interface ProductProps {
  title: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
}

export function Product({ title, description, imageAlt, imageSrc }: ProductProps): ReactElement {
  return (
    <article className='p-6 bg-background-secondary rounded-2xl flex-1 max-lg:p-4'>
      <div className='relative mb-8 w-full aspect-[1.14] max-md:aspect-[1.24]'>
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          className='object-cover rounded-lg' />
      </div>
      <p className='text-2xl mb-2.5 max-lg:text-xl'>
        <strong>{title}</strong>
      </p>
      <p>{description}</p>
    </article>
  );
}
