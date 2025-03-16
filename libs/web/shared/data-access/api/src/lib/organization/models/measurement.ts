export class Measurement {
  public firstMeasurement: number | string | null;
  public secondMeasurement: number | string | null;
  public change: number | null;

  constructor(model: Partial<Measurement>) {
    Object.assign(this, model);
  }

  public static fromRaw(value: Record<string | number, null>): Measurement {
    const keys = Object.keys(value).filter((key) => key !== 'change');
    const [firstKey, secondKey] = keys;

    return new Measurement({
      firstMeasurement: value[firstKey] ?? null,
      secondMeasurement: value[secondKey] ?? null,
      change: value.change ?? null,
    });
  }
}
