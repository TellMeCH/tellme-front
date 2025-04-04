'use client';

import { Textarea as NextUITextarea, TextAreaProps } from '@heroui/react';
import clsx from 'clsx';
import { forwardRef } from 'react';
import { FormGroup, FormGroupProps } from '@tellme/shared/ui/ui-kit';

interface TextareaClassNames {
  label?: string;
  input?: string;
  containerInner?: string;
}

export interface TextareaProps extends Omit<TextAreaProps, 'className' | 'errorMessage'> {
  classNames?: TextareaClassNames;
  hasError?: boolean;
  formGroupProps?: FormGroupProps;
}

export const Textarea = forwardRef<HTMLTextAreaElement | null, TextareaProps>((props, ref) => {
  const { classNames, hasError, formGroupProps, ...restProps } = props;

  return (
    <FormGroup {...formGroupProps}>
      <NextUITextarea
        ref={ref}
        aria-describedby={formGroupProps?.errorID}
        isInvalid={hasError}
        variant='bordered'
        classNames={{
          inputWrapper: clsx('form__control', classNames?.containerInner),
          mainWrapper: 'form__group__inner',
          input: classNames?.input,
          label: clsx('form__label', classNames?.label),
        }}
        labelPlacement='outside'
        {...restProps}
      />
    </FormGroup>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
