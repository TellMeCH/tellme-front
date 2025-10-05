import { Expose } from 'class-transformer';

export class SuggestedTopicErrorData {
  @Expose({ name: 'non_field_errors' })
  public nonFieldErrors?: Array<string>;

  constructor(model: Partial<SuggestedTopicErrorData>) {
    Object.assign(this, model);
  }
}
