import { Expose } from 'class-transformer';
import { BaseEntity } from '../../common';
import { TranscriptItemClass } from '../enums';

export class TranscriptItem extends BaseEntity {
  @Expose()
  public message: string;

  @Expose()
  public class: TranscriptItemClass;

  constructor(model: Partial<TranscriptItem>) {
    super(model);
    Object.assign(this, model);
  }
}
