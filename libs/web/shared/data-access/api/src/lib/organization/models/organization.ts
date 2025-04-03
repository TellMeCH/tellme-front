import { Expose } from 'class-transformer';
import { BaseEntity } from '../../common';

export class Organization extends BaseEntity {
  @Expose()
  public name: string;

  constructor(model: Partial<Organization>) {
    super(model);
    Object.assign(this, model);
  }
}
