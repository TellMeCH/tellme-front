import { SwitchProps } from '@heroui/react';
import { ReactElement } from 'react';
import { FieldValues, useController } from 'react-hook-form';
import { FormControlProps } from '@tellme/web/shared/utils/form';
import { Switch } from '../switch/component';

export type FormSwitchProps<T extends FieldValues> = FormControlProps<T> & SwitchProps;

export function FormSwitch<T extends FieldValues>({
  name,
  control,
  onChange,
  ...restProps
}: FormSwitchProps<T>): ReactElement {
  const { field } = useController({ control, name });

  return (
    <Switch
      isSelected={field.value}
      onValueChange={field.onChange}
      onBlur={field.onBlur}
      ref={field.ref as any}
      {...restProps}
    />
  );
}
