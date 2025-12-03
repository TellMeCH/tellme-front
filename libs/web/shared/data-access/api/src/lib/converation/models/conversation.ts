import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Expose } from 'class-transformer';
import { DateTime } from 'luxon';
import { BaseEntity } from '../../common';

export class Conversation extends BaseEntity {
  @Expose()
  @TransformDate()
  public date: DateTime;

  @Expose()
  public title: string;

  constructor(model: Partial<Conversation>) {
    super(model);
    Object.assign(this, model);
  }
}
