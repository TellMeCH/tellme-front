'use client';

import { Textarea as HeroUITextarea, TextAreaProps } from '@heroui/react';
import clsx from 'clsx';
import { forwardRef, ReactNode } from 'react';
import { FormGroup, FormGroupProps } from '../form-group/component';

interface TextareaClassNames {
  label?: string;
  input?: string;
  containerInner?: string;
}

export interface TextareaProps extends Omit<TextAreaProps, 'errorMessage'> {
  classNames?: TextareaClassNames;
  hasError?: boolean;
  formGroupProps?: FormGroupProps;
  inputColor?: 'light' | 'transparent';
  labelRightAccessory?: ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement | null, TextareaProps>((props, ref) => {
  const {
    classNames,
    hasError,
    formGroupProps,
    inputColor = 'light',
    label,
    labelRightAccessory,
    ...restProps
  } = props;

  return (
    <FormGroup {...formGroupProps}>
      <HeroUITextarea
        ref={ref}
        aria-describedby={formGroupProps?.errorID}
        isInvalid={hasError}
        variant='bordered'
        classNames={{
          inputWrapper: clsx('form__control', `form__control_${inputColor}`, classNames?.containerInner),
          mainWrapper: 'form__group__inner',
          input: classNames?.input,
        }}
        label={
          <label
            className={clsx(
              'form__label',
              inputColor === 'transparent' && 'form__label_light',
              classNames?.label,
              'flex items-center gap-2',
            )}>
            <span>{label}</span>
            {labelRightAccessory}
          </label>
        }
        labelPlacement='outside'
        {...restProps}
      />
    </FormGroup>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
