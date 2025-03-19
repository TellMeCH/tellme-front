export class Measurement {
  public firstMeasurement: number | string | null;
  public secondMeasurement: number | string | null;
  public change: number | null;

  constructor(model: Partial<Measurement>) {
    Object.assign(this, model);
  }
}
