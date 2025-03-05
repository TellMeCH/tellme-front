import { Divider } from '@heroui/react';
import { ReactElement } from 'react';

interface DividerWithTextProps {
  text: string;
}

export function DividerWithText({ text }: DividerWithTextProps): ReactElement {
  return (
    <div className='relative pt-3'>
      <Divider className='bg-background-tertiary scale-x-[83%]' />
      <span className='bg-background-secondary px-6 absolute text-text-secondary left-[50%] translate-x-[-50%] translate-y-[-50%]'>
        {text}
      </span>
    </div>
  );
}
