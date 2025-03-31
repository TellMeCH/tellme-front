import { Expose } from 'class-transformer';

export class ErrorResponse<T extends object> {
  @Expose()
  public code: string;

  @Expose()
  public message?: string;

  @Expose()
  public data: T;

  constructor(model: Partial<ErrorResponse<T>>) {
    Object.assign(this, model);
  }
}
