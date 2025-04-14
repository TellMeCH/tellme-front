import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';

export class Overview {
  @Expose()
  public id: number;

  @Expose()
  @Type(() => DateTime)
  @TransformDate()
  public currentMonth: DateTime;

  @Expose()
  @Type(() => DateTime)
  @TransformDate()
  public previousMonth: DateTime;

  constructor(model: Partial<Overview>) {
    Object.assign(this, model);
  }
}
