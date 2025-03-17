import { Expose } from 'class-transformer';
import { UpsertRequest } from '../../common';

export class TopicUpsertRequest extends UpsertRequest {
  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose({ name: 'is_active' })
  public isActive: boolean;

  constructor(model: Partial<TopicUpsertRequest>) {
    super(model);
    Object.assign(this, model);
  }
}
