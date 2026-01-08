import { BaseEntity, PaginationResponse } from '../models';

export function createInfiniteQueryOptions<TEntity extends BaseEntity = BaseEntity>(): typeof result {
  const result = {
    initialPageParam: undefined,
    getNextPageParam: (lastPage: PaginationResponse<TEntity>) => lastPage.nextCursor || undefined,
  };

  return result;
}
