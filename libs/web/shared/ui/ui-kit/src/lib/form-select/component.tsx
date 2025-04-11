'use client';

import { ReactElement } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { AppSelect, AppSelectProps } from '../select/component';

export interface FormSelectProps<T extends FieldValues> extends AppSelectProps {
  name: Path<T>;
  control: Control<T>;
}

export function FormSelect<T extends FieldValues>({
  name,
  control,
  onChange,
  ...restProps
}: FormSelectProps<T>): ReactElement {
  const { field, fieldState } = useController({ control, name });

  return (
    <AppSelect
      value={field.value}
      selectedKeys={field.value ? [field.value.toString()] : []}
      onChange={onChange ?? field.onChange}
      hasError={!!fieldState.error}
      errorID={fieldState.error ? `${name}-error` : undefined}
      errorMessage={fieldState.error?.message}
      {...restProps}
    />
  );
}
