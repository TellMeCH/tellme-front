export class Measurement {
  public previousMeasurement: number | string | null;
  public currentMeasurement: number | string | null;
  public change: number | null;

  constructor(model: Partial<Measurement>) {
    Object.assign(this, model);
  }
}
