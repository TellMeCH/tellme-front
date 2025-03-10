'use client';

import { CheckboxProps } from '@heroui/react';
import { ReactElement } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import { FormControlProps } from '@tellme/web/shared/utils/form';
import { Checkbox } from '../checkbox/component';

export type FormCheckboxProps<T extends FieldValues> = FormControlProps<T> & CheckboxProps;

export function FormCheckbox<T extends FieldValues>({
  name,
  control,
  onChange,
  ...restProps
}: FormCheckboxProps<T>): ReactElement {
  const { field } = useController({ control, name });

  return (
    <Checkbox
      isSelected={field.value}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      ref={field.ref as any}
      {...restProps}
    />
  );
}
