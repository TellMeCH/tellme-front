import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from '../../common';

export class Topic extends BaseEntity {
  @Expose()
  public name: string;

  @Expose()
  public description: string;

  @Expose({ name: 'is_active' })
  public isActive: boolean;

  @Exclude()
  public fallbackId?: number;

  @Exclude()
  public get resolvedId(): number {
    return this.id !== -1 ? this.id : (this.fallbackId ?? -1);
  }

  constructor(model: Partial<Topic>) {
    super(model);
    Object.assign(this, model);
  }
}
