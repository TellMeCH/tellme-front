import { Expose } from 'class-transformer';

export class Topic {
  @Expose()
  public id: string;

  @Expose()
  public name: string;

  @Expose()
  public description: string;

  constructor(model: Partial<Topic>) {
    Object.assign(this, model);
  }
}
