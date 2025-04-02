import clsx from 'clsx';
import { ReactElement } from 'react';
import { Icon, IconName } from '@tellme/shared/ui/ui-kit';
import styles from './component.module.scss';

interface ProcessStepProps {
  number: number;
  text: string;
}

export function ProcessStep({ number, text }: ProcessStepProps): ReactElement {
  return (
    <li className={clsx(styles.processstep, 'list-none flex flex-col gap-8 items-center text-center max-w-[380px]')}>
      <Icon name={`number_${number}` as IconName} />
      <p className='font-medium text-xl max-lg:text-medium'>{text}</p>
    </li>
  );
}
