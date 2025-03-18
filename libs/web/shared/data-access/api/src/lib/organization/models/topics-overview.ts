import { Overview } from './overview';

export class TopicsOverview extends Overview {
  // @Expose()
  // @Type(() => Topics)
  // public topics: Topics;

  constructor(model: Partial<TopicsOverview>) {
    super(model);
    Object.assign(this, model);
  }
}
