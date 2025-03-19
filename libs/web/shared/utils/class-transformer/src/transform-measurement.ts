import { Transform, TransformFnParams } from 'class-transformer';
import { Measurement } from './models';

export function TransformMeasurement(): PropertyDecorator {
  return Transform(
    ({ value }: TransformFnParams) => {
      if (!value) {
        return null;
      }

      const keys = Object.keys(value).filter((key) => key !== 'change');
      const [firstKey, secondKey] = keys;

      return new Measurement({
        firstMeasurement: value[firstKey] ?? null,
        secondMeasurement: value[secondKey] ?? null,
        change: value.change ?? null,
      });
    },
    { toClassOnly: true },
  );
}
