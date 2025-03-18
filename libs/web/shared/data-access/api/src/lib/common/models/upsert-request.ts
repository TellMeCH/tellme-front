import { Expose } from 'class-transformer';

export class UpsertRequest {
  @Expose()
  public id: number;

  constructor(model: Partial<UpsertRequest>) {
    Object.assign(this, model);
  }
}
