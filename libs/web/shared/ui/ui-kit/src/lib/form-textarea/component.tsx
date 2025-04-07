'use client';

import { ReactElement } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import { Textarea, TextareaProps } from '@tellme/shared/ui/ui-kit';
import { FormControlProps } from '@tellme/web/shared/utils/form';

export type FormTextareaProps<T extends FieldValues> = FormControlProps<T> & TextareaProps;

export function FormTextarea<T extends FieldValues>({
  name,
  control,
  onChange,
  ...restProps
}: FormTextareaProps<T>): ReactElement {
  const { field, fieldState } = useController({ control, name });

  return (
    <Textarea
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
