import { Expose } from 'class-transformer';

export class ModifiedBaseEntity {
  @Expose()
  public id: number;

  constructor(model: Partial<ModifiedBaseEntity>) {
    Object.assign(this, model);
  }
}
