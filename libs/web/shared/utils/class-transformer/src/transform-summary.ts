import { Transform } from 'class-transformer';
import { camelCase, isPlainObject } from 'lodash-es';

export function TransformSummary(): PropertyDecorator {
  return Transform(
    ({ value }) => {
      if (!value || !isPlainObject(value)) return [];

      return Object.entries<string>(value).map(([originalKey, originalValue]) => ({
        key: camelCase(originalKey),
        name: originalKey,
        description: originalValue,
      }));
    },
    { toClassOnly: true },
  );
}
