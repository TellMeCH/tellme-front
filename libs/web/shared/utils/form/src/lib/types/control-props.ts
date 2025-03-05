import { Control, FieldValues, Path } from 'react-hook-form';

export type FormControlProps<
  TFieldValues extends FieldValues,
  TPath extends Path<TFieldValues> = Path<TFieldValues>,
> = {
  name: TPath;
  control: Control<TFieldValues>;
};
