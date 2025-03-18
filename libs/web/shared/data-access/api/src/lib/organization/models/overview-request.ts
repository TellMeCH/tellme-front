import { Expose } from 'class-transformer';

export class OverviewRequest {
  @Expose({ name: 'per_topic' })
  public perTopic?: boolean;

  constructor(model: Partial<OverviewRequest>) {
    Object.assign(this, model);
  }
}
