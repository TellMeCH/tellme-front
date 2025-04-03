import { Expose } from 'class-transformer';
import { ModifiedBaseEntity } from '../../common';

export class ModifiedTopic extends ModifiedBaseEntity {
  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose({ name: 'is_active' })
  public isActive: boolean;

  constructor(model: Partial<ModifiedTopic>) {
    super(model);
    Object.assign(this, model);
  }
}
