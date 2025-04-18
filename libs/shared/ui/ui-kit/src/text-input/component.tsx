'use client';

import { Input, InputProps } from '@heroui/react';
import clsx from 'clsx';
import { ChangeEvent, ReactNode, forwardRef, useState } from 'react';
import { FormGroup, FormGroupProps } from '../form-group/component';
import { Icon } from '../icon/component';

interface TextInputClassNames {
  label?: string;
  input?: string;
  containerInner?: string;
}

export interface TextInputProps extends Omit<InputProps, 'className' | 'errorMessage'> {
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
  accessoryLeft?: ReactNode;
  accessoryRight?: ReactNode;
  classNames?: TextInputClassNames;
  hasError?: boolean;
  inputSize?: 'big' | 'small';
  inputColor?: 'light' | 'transparent';
  formGroupProps?: FormGroupProps;
  labelRightAccessory?: ReactNode;
}

export const TextInput = forwardRef<HTMLInputElement | null, TextInputProps>((props, ref) => {
  const {
    type,
    accessoryLeft,
    accessoryRight,
    classNames,
    hasError,
    inputSize = 'small',
    inputColor = 'light',
    value,
    formGroupProps,
    label,
    labelRightAccessory,
    ...restProps
  } = props;
  const { className: formGroupClassName, ...restFormGroupProps } = formGroupProps ?? {};
  const [isPasswordVisible, setPasswordVisible] = useState<boolean>(false);

  const togglePasswordVisibility = (): void => {
    setPasswordVisible((currentValue) => !currentValue);
  };

  const renderPasswordToggle = (): ReactNode => (
    <button
      type='button'
      onClick={togglePasswordVisibility}
      className='form__control__password'>
      <Icon name={isPasswordVisible ? 'eye_closed' : 'eye'} />
    </button>
  );

  const renderEndContent = (): ReactNode => {
    if (type === 'password') {
      return renderPasswordToggle();
    }

    return accessoryRight;
  };

  return (
    <FormGroup
      className={clsx([
        {
          form__group_accessory_left: accessoryLeft,
          form__group_accessory_right: accessoryRight,
          form__group_password: type === 'password',
        },
        formGroupClassName,
      ])}
      {...restFormGroupProps}>
      <Input
        ref={ref}
        type={isPasswordVisible ? 'text' : (type ?? 'text')}
        aria-describedby={restFormGroupProps.errorID}
        value={value}
        isInvalid={hasError}
        variant='bordered'
        classNames={{
          inputWrapper: clsx(
            'form__control',
            `form__control_${inputSize}`,
            `form__control_${inputColor}`,
            classNames?.containerInner,
          ),
          mainWrapper: 'form__group__inner',
          input: classNames?.input,
        }}
        startContent={accessoryLeft}
        endContent={renderEndContent()}
        labelPlacement='outside'
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
        {...restProps}
      />
    </FormGroup>
  );
});

TextInput.displayName = 'TextInput';
export default TextInput;
