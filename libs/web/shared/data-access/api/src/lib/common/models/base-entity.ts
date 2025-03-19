import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Exclude, Expose } from 'class-transformer';
import { immerable } from 'immer';
import { DateTime } from 'luxon';

export class BaseEntity {
  public [immerable] = true;

  @Expose()
  public url: string; // Example https://tellme-service-716439647851.europe-west6.run.app/api/v1/topics/28/

  @Expose()
  @TransformDate()
  public created: DateTime;

  @Expose()
  @TransformDate()
  public updated: DateTime;

  @Exclude()
  public get id(): number {
    const segments = this.url.split('/');

    return Number(segments[segments.length - 2]);
  }

  constructor(model: Partial<BaseEntity>) {
    Object.assign(this, model);
  }
}
