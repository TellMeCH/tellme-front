import clsx from 'clsx';
import { ReactElement, useState } from 'react';

interface DateTimeFiltersProps {
  options: Array<{ label: string; value: string }>;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export function DateTimeFilters({ options, defaultValue, onChange }: DateTimeFiltersProps): ReactElement {
  const [selected, setSelected] = useState(defaultValue || options[0]?.value);

  const handleSelect = (value: string): void => {
    setSelected(value);
    onChange?.(value);
  };

  return (
    <div className='flex gap-2'>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => handleSelect(option.value)}
          className={clsx(
            'px-4 py-2 rounded-full text-sm transition-colors',
            selected === option.value ? 'bg-black text-white' : 'bg-gray-100 text-black hover:bg-gray-200',
          )}>
          {option.label}
        </button>
      ))}
    </div>
  );
}
