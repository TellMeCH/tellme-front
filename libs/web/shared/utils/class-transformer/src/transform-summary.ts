import { Transform } from 'class-transformer';
import { camelCase, isPlainObject } from 'lodash-es';

export function TransformSummary(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (!value || !isPlainObject(value)) return value;

      return Object.fromEntries(
        Object.entries<string>(value).map(([originalKey, value]) => [
          camelCase(originalKey),
          {
            name: originalKey,
            description: value,
          },
        ]),
      );
    },
    { toClassOnly: true },
  );
}
