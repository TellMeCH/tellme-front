import { Expose } from 'class-transformer';

export class CustomerSearchParams {
  @Expose()
  public ordering?: string;

  @Expose()
  public query?: string;
}
