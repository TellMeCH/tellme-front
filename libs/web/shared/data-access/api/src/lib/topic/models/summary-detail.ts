export class SummaryDetail {
  public name: string;
  public description: string;

  constructor(model: Partial<SummaryDetail>) {
    Object.assign(this, model);
  }
}
