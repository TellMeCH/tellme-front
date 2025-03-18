import { Expose, Type } from 'class-transformer';
import { General } from './general';
import { Overview } from './overview';

export class GeneralOverview extends Overview {
  @Expose()
  @Type(() => General)
  public general: General;

  constructor(model: Partial<GeneralOverview>) {
    super(model);
    Object.assign(this, model);
  }
}
