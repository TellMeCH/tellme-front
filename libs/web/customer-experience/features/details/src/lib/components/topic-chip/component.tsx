import { Chip } from '@heroui/react';
import { ReactElement } from 'react';
import { Icon } from '@tellme/shared/ui/ui-kit';

interface TopicChipProps {
  name: string;
  isSuggested?: boolean;
}

export function TopicChip({ name, isSuggested }: TopicChipProps): ReactElement {
  return (
    <Chip
      color='primary'
      variant='bordered'
      startContent={isSuggested && <Icon name='sparkle' theme='brand_primary' />}>
      {name}
    </Chip>
  );
}
