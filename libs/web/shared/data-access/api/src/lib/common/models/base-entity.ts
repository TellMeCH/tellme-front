import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Exclude, Expose } from 'class-transformer';
import { immerable } from 'immer';
import { DateTime } from 'luxon';
import { getIdFromUrl } from '@tellme/web/shared/utils/strings';

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
    if (!this.url) {
      return -1;
    }

    return getIdFromUrl(this.url);
  }

  constructor(model: Partial<BaseEntity>) {
    Object.assign(this, model);
  }
}
