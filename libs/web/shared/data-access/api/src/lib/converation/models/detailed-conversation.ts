import { Expose, Type } from 'class-transformer';
import { SuggestedTopic } from '../../suggested-topic/models/suggested-topic';
import { Topic } from '../../topic/models/topic';
import { Conversation } from './conversation';

export class DetailedConversation extends Conversation {
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

  constructor(model: Partial<DetailedConversation>) {
    super(model);
    Object.assign(this, model);
  }
}
