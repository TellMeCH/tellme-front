import { DropdownSection, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input } from '@heroui/react';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import { ReactElement, useState } from 'react';
import { Icon } from '@tellme/shared/ui/ui-kit';

interface TopicSelectProps {
  items: Array<{ value: string; label: string }>;
  selectedValue: string | null;
  onSelect: (key: string) => void;
}

export function TopicSelect({ items, selectedValue, onSelect }: TopicSelectProps): ReactElement {
  const t = useTranslations('topic.ANALYSIS.SELECT');

  const [value, setValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredItems = items.filter((item) => item.label.toLowerCase().includes(value.toLowerCase()));

  return (
    <Dropdown className='p-0 w-[300px] shadow-lg' onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button data-testid='dropdown-trigger' className='w-10 min-w-10 h-10 p-0 rounded-xl bg-background-primary'>
          <Icon name='arrow_up' className={clsx('transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label={t('TEXT_DROPDOWN_AREA_LABEL')} className='p-2'>
        {/* TODO: Search functionality is hidden now. Remove hidden if necessary */}
        <DropdownItem
          isReadOnly
          key='search'
          className='p-0 m-0 cursor-default data-[hover=true]:bg-inherit hidden'>
          <Input
            placeholder={t('TEXT_PLACEHOLDER_SEARCH')}
            value={value}
            startContent={<Icon name='search' />}
            onValueChange={setValue}
            classNames={{
              inputWrapper:
                'rounded-2 my-2 bg-background-primary shadow-none data-[hover=true]:bg-background-primary group-data-[focus=true]:bg-background-primary ',
              input: 'p-0',
            }}
          />
        </DropdownItem>
        <DropdownSection
          className='p-1 max-h-[248px] overflow-y-scroll 
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-opacity-0
                [&::-webkit-scrollbar-thumb]:rounded
              [&::-webkit-scrollbar-thumb]:bg-text-tertiary'>
          {filteredItems.map((item) => (
            <DropdownItem
              key={item.value}
              textValue={item.label}
              data-testid='dropdown-item'
              onPress={() => onSelect(item.value)}
              className={clsx(
                'rounded-2 py-3 truncate data-[hover=true]:bg-background-primary',
                selectedValue === item.value && 'bg-background-primary',
              )}>
              {item.label}
            </DropdownItem>
          ))}
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
