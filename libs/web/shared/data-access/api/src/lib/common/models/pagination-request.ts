import { Expose } from 'class-transformer';

export class PaginationRequest {
  @Expose()
  public cursor?: string;

  @Expose({ name: 'page_size' })
  public pageSize?: number;

  constructor(request: Partial<PaginationRequest>) {
    Object.assign(this, request);
  }
}
