import { Transform, TransformFnParams } from 'class-transformer';
import { Measurement } from './models';

export function TransformMeasurement(): PropertyDecorator {
  return Transform(
    ({ value }: TransformFnParams) => {
      if (!value) {
        return null;
      }

      const keys = Object.keys(value)
        .filter((key) => key !== 'change' && key !== 'date')
        .sort();

      const [previousMeasurementKey, currentMeasurementKey] = keys;

      return new Measurement({
        previousMeasurement: value[previousMeasurementKey] ?? null,
        currentMeasurement: value[currentMeasurementKey] ?? null,
        change: value.change ?? null,
      });
    },
    { toClassOnly: true },
  );
}
