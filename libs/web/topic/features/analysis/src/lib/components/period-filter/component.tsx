import clsx from 'clsx';
import { ReactElement, useState } from 'react';
import { Button } from '@tellme/shared/ui/ui-kit';

interface PeriodFilterProps {
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function PeriodFilter({ options, defaultValue, onChange }: PeriodFilterProps): ReactElement {
  const [selected, setSelected] = useState(defaultValue || options[0]?.value);

  const handleSelect = (value: string): void => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className='flex gap-2'>
      {options.map((option) => (
        <Button
          key={option.value}
          onPress={() => handleSelect(option.value)}
          className={clsx(
            'bg-background-primary transition-colors',
            selected === option.value && 'bg-black text-text-foreground',
          )}
          variant='flat'>
          <span className={selected === option.value ? 'text-text-foreground' : 'text-text-primary'}>
            {option.label}
          </span>
        </Button>
      ))}
    </div>
  );
}
