import { Expose } from 'class-transformer';

export class CustomerSummary {
  @Expose({ name: 'Expectations Met' })
  public expectationsMet: string;

  @Expose({ name: 'Improvement Suggestions' })
  public improvementSuggestions: string;

  @Expose({ name: 'Liked Features' })
  public likedFeatures: string;

  @Expose({ name: 'Disliked Features' })
  public dislikedFeatures: string;

  @Expose({ name: 'Suggested Email Subject' })
  public suggestedEmailSubject: string;

  @Expose({ name: 'Suggested Email Body' })
  public suggestedEmailBody: string;

  constructor(model: Partial<CustomerSummary>) {
    Object.assign(this, model);
  }
}
