'use client';

import { DropdownSection, Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Input } from '@heroui/react';
import clsx from 'clsx';
import { type ReactElement } from 'react';
import { useState } from 'react';
import { Header, Heading, Icon } from '@tellme/web/shared/ui/ui-kit';

const items = [
  { key: 'product-stock', label: 'Product Stock' },
  { key: 'order-status', label: 'Order Status' },
  { key: 'returns', label: 'Returns and Exchanges' },
  { key: 'sizing', label: 'Sizing and Fit' },
  { key: 'promotions', label: 'Promotions' },
];

export function TopicAnalysis(): ReactElement {
  const [selectedKey, setSelectedKey] = useState('sizing');
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const selectedItem = items.find((item) => item.key === selectedKey);

  const filteredItems = items.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className='min-h-full flex flex-col gap-2 '>
      <Header title={'Topic Analysis'} />
      <div className='flex flex-col flex-1 bg-background-secondary rounded-2xl py-6 px-9 gap-6'>
        <div className='flex flex-row gap-5 items-center'>
          <Heading level={2} className='text-3xl'>
            {selectedItem?.label}
          </Heading>
          <Dropdown className='p-0 w-[300px] shadow-lg' onOpenChange={(open) => setIsOpen(open)}>
            <DropdownTrigger>
              <Button className='w-10 min-w-10 h-10 p-0 rounded-xl bg-background-primary'>
                <Icon name='arrow_up' className={clsx('transition-transform', isOpen ? 'rotate-180' : 'rotate-0')} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              selectedKeys={[selectedKey]}
              aria-label='Dropdown with search'
              className='p-2 left-0 top-0'>
              <DropdownItem
                isReadOnly
                key='search'
                className='p-0 m-0 cursor-default data-[hover=true]:bg-inherit'>
                <Input
                  placeholder='Search'
                  value={search}
                  startContent={<Icon name='search' />}
                  onValueChange={setSearch}
                  classNames={{
                    inputWrapper:
                      'rounded-2 my-2 bg-background-primary shadow-none data-[hover=true]:bg-background-primary group-data-[focus=true]:bg-background-primary ',
                    input: ' p-0',
                  }}
                />
              </DropdownItem>
              <DropdownSection
                className='p-0 max-h-[248px] overflow-y-scroll 
                [&::-webkit-scrollbar]:w-1
                [&::-webkit-scrollbar-track]:bg-opacity-0
                [&::-webkit-scrollbar-thumb]:rounded
              [&::-webkit-scrollbar-thumb]:bg-gray-300'>
                {items
                  .filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
                  .map((item) => (
                    <DropdownItem
                      key={item.key}
                      onPress={() => setSelectedKey(item.key)}
                      className={clsx(
                        'rounded-2 py-3 truncate data-[hover=true]:bg-background-primary',
                        selectedKey === item.key && 'bg-background-primary',
                      )}>
                      {item.label}
                    </DropdownItem>
                  ))}
              </DropdownSection>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
}
