import { TransformDate } from '@ronas-it/rtkq-entity-api';
import { Expose, Type } from 'class-transformer';
import { DateTime } from 'luxon';
import { BaseEntity } from '../../common';
import { SuggestedTopic } from '../../suggested-topic/models/suggested-topic';
import { Topic } from '../../topic/models/topic';

export class Conversation extends BaseEntity {
  @Expose()
  @TransformDate()
  public date: DateTime;

  @Expose()
  public sentiment: number;

  @Expose({ name: 'duration' })
  public durationSeconds: number;

  @Expose({ name: 'resolved' })
  public isResolved: boolean;

  @Expose()
  public summary: string;

  @Expose({ name: 'suggested_topic_data' })
  @Type(() => SuggestedTopic)
  public suggestedTopics: Array<SuggestedTopic>;

  @Expose({ name: 'topic_data' })
  @Type(() => Topic)
  public topics: Array<Topic>;

  constructor(model: Partial<Conversation>) {
    super(model);
    Object.assign(this, model);
  }
}
