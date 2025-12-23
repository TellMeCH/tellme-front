import { ButtonProps } from '@heroui/react';
import { Fragment, ReactElement } from 'react';
import { Button } from '@tellme/shared/ui/ui-kit';
import { Heading, Spinner } from '@tellme/web/shared/ui/ui-kit';

interface SuggestedContentProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonProps: Omit<ButtonProps, 'ref'>;
  generatingText: string;
  error?: string;
}

export function SuggestedContent({
  title,
  subtitle,
  generatingText,
  buttonProps,
  description,
  error,
}: SuggestedContentProps): ReactElement {
  const hasContent = subtitle && description;

  return (
    <article className='pt-2'>
      <Heading level={2} className='text-base mb-6'>
        {title}
      </Heading>
      {hasContent ? (
        <Fragment>
          <p className='mb-3 text-text-secondary'>{subtitle}</p>
          <p className='max-w-[900px] mb-6 whitespace-pre-wrap'>{description}</p>
          <div className='flex items-center gap-4'>
            <Button variant='bordered' {...buttonProps} />
            {!!error && <p className='text-brand-danger'>{error}</p>}
          </div>
        </Fragment>
      ) : (
        <div className='flex gap-4 items-center'>
          <Spinner size='sm' color='default' />
          <p className='text-text-secondary'>{generatingText}</p>
        </div>
      )}
    </article>
  );
}
