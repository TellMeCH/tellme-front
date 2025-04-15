import {
  Dropdown as HeroUIDropdown,
  DropdownItem,
  DropdownTrigger,
  DropdownMenu,
  DropdownProps as HeroUIDropdownProps,
  DropdownItemProps,
} from '@heroui/react';
import clsx from 'clsx';
import { ReactElement } from 'react';
import { Button, Icon } from '@tellme/shared/ui/ui-kit';
import styles from './component.module.scss';

interface DropdownProps extends Omit<HeroUIDropdownProps, 'children'> {
  options: Array<DropdownItemProps>;
  testId: string;
}

export function Dropdown({ options, testId, ...restProps }: DropdownProps): ReactElement {
  return (
    <HeroUIDropdown {...restProps}>
      <DropdownTrigger>
        <Button
          variant='bordered'
          isIconOnly
          data-testid={testId}>
          <Icon name='more' />
        </Button>
      </DropdownTrigger>
      <DropdownMenu items={options} classNames={{ list: 'p-0', base: 'p-0' }}>
        {({ key, classNames, ...restProps }) => (
          <DropdownItem
            key={key}
            {...restProps}
            classNames={{ ...classNames, base: clsx(styles.dropdown__item, classNames?.base) }}
            data-testid={`${key}-dropdown-item`}
          />
        )}
      </DropdownMenu>
    </HeroUIDropdown>
  );
}
