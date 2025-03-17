import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { General } from './general';

export class Overview {
  @Expose()
  public id: number;

  @Expose()
  @Type(() => DateTime)
  @TransformDate()
  public firstDate: DateTime;

  @Expose()
  @Type(() => DateTime)
  @TransformDate()
  public secondDate: DateTime;

  @Type(() => General)
  @Expose()
  public general: General;

  constructor(model: Partial<Overview>) {
    Object.assign(this, model);
  }
}
