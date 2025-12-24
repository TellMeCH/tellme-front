'use client';

import { ReactElement } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import { TextInput, TextInputProps } from '@tellme/shared/ui/ui-kit';
import { FormControlProps } from '@tellme/web/shared/utils/form';

export type FormTextInputProps<T extends FieldValues> = FormControlProps<T> & TextInputProps;

export function FormTextInput<T extends FieldValues>({
  name,
  control,
  onChange,
  formGroupProps,
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
        ...formGroupProps,
      }}
      ref={field.ref}
      {...restProps}
    />
  );
}
