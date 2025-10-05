import { Expose } from 'class-transformer';
import { BaseEntity } from '../../common';

export class SuggestedTopic extends BaseEntity {
  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose({ name: 'conversation_count' })
  public conversationsCount: number;

  constructor(model: Partial<SuggestedTopic>) {
    super(model);
    Object.assign(this, model);
  }
}
