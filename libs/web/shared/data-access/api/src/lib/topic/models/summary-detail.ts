export class SummaryDetail {
  public key: string;
  public name: string;
  public description: string;

  constructor(init?: Partial<SummaryDetail>) {
    Object.assign(this, init);
  }
}
