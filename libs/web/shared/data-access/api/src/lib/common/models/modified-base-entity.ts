import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Expose } from 'class-transformer';
import { DateTime } from 'luxon';

export class ModifiedBaseEntity {
  @Expose()
  public id: number;

  @Expose()
  @TransformDate()
  public created?: DateTime;

  constructor(model: Partial<ModifiedBaseEntity>) {
    Object.assign(this, model);
  }
}
