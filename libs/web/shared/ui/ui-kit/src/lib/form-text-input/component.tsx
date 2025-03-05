'use client';

import { ReactElement } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';
import { TextInput, TextInputProps } from '../text-input/component';

export interface FormTextInputProps<T extends FieldValues> extends TextInputProps {
  name: Path<T>;
  control: Control<T>;
}

export function FormTextInput<T extends FieldValues>({
  name,
  control,
  onChange,
  ...restProps
}: FormTextInputProps<T>): ReactElement {
  const { field, fieldState } = useController({ control, name });

  return (
    <TextInput
      value={field.value}
      onChange={onChange ?? field.onChange}
      onBlur={field.onBlur}
      hasError={!!fieldState.error}
      formGroupProps={{
        errorMessage: fieldState.error?.message,
        errorID: fieldState.error ? `${name}-error` : undefined,
      }}
      ref={field.ref}
      {...restProps}
    />
  );
}
