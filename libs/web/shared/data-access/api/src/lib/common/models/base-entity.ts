import { Expose } from 'class-transformer';

export class BaseEntity {
  @Expose()
  public id: number;

  @Expose()
  public created: string;

  @Expose()
  public updated: string;

  constructor(model: Partial<BaseEntity>) {
    Object.assign(this, model);
  }
}
