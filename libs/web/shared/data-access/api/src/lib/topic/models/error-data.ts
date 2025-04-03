import { Expose } from 'class-transformer';

export class TopicErrorData {
  @Expose({ name: 'non_field_errors' })
  public nonFieldErrors?: Array<string>;

  @Expose()
  public name?: Array<string>;

  constructor(model: Partial<TopicErrorData>) {
    Object.assign(this, model);
  }
}
