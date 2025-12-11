import { BaseEntity, PaginationResponse } from '../models';

export function createInfiniteQueryOptions<TEntity extends BaseEntity = BaseEntity>() {
  return {
    initialPageParam: undefined,
    getNextPageParam: (lastPage: PaginationResponse<TEntity>) => lastPage.nextCursor || undefined,
  };
}
