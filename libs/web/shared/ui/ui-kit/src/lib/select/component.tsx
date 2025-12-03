'use client';

import { Select, SelectItem, SelectItemProps, SelectProps } from '@heroui/react';
import clsx from 'clsx';
import { isArray } from 'lodash';
import { forwardRef } from 'react';
import { FormGroup } from '@tellme/shared/ui/ui-kit';
import styles from './component.module.scss';

export interface AppSelectProps extends Omit<SelectProps, 'children' | 'value'> {
  options: Array<SelectItemProps>;
  value?: string;
  label?: string;
  hasError?: boolean;
  errorMessage?: string;
  errorID?: string;
  testId?: string;
}

export const AppSelect = forwardRef<HTMLSelectElement | null, AppSelectProps>(
  (
    {
      options = [],
      disallowEmptySelection = true,
      label,
      hasError,
      errorMessage,
      errorID,
      popoverProps,
      classNames,
      isDisabled,
      size,
      testId,
      listboxProps,
      ...restProps
    },
    ref,
  ) => {
    const selectedKeys = isArray(restProps?.selectedKeys)
      ? restProps?.selectedKeys?.map((key) => key.toString())
      : restProps?.selectedKeys;

    return (
      <FormGroup errorMessage={errorMessage} errorID={errorID}>
        <Select
          ref={ref}
          aria-label={label}
          aria-describedby={errorID}
          label={label}
          labelPlacement='outside'
          isDisabled={isDisabled}
          disallowEmptySelection={disallowEmptySelection}
          popoverProps={{
            ...popoverProps,
            // Necessary to close popover by clicking on trigger
            //shouldCloseOnInteractOutside: () => true,
            radius: 'md',
            containerPadding: 0,
            className: clsx('outline-none', popoverProps?.className),
            classNames: {
              content: 'border-none outline-none py-2 px-0 text-medium',
            },
          }}
          {...restProps}
          selectedKeys={selectedKeys}
          size={size}
          listboxProps={{
            ...listboxProps,
            hideSelectedIcon: true,
          }}
          classNames={{
            ...classNames,
            trigger: clsx(
              'min-h-[48px]',
              'form__control',
              'h-auto',
              isDisabled && 'bg-background-secondary opacity-[0.4] border-none',
              !!hasError && 'form__control_error',
              classNames?.trigger,
            ),
            value: classNames?.value,
            listbox: clsx('p-0', classNames?.listbox),
            innerWrapper: classNames?.innerWrapper,
            listboxWrapper: clsx('max-h-[364px]', classNames?.listboxWrapper),
          }}>
          {options?.map((option) => (
            <SelectItem
              {...option}
              key={option.key}
              className={clsx(styles.select__item, option.className)}
              data-testid={`${String(option.key).toLowerCase()}-select-item`}
            />
          ))}
        </Select>
      </FormGroup>
    );
  },
);

AppSelect.displayName = 'AppSelect';
export default AppSelect;
