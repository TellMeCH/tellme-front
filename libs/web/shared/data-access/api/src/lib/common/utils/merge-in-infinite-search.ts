import { BaseEntity, PaginationRequest, PaginationResponse } from '../models';

export const mergeInInfiniteSearch = <
  TEntity extends BaseEntity,
  TRequest extends PaginationRequest = PaginationRequest,
>(
  cache: PaginationResponse<TEntity>,
  response: PaginationResponse<TEntity>,
  { arg }: { arg: TRequest },
) => {
  if (!arg.cursor) {
    cache.results = response.results;
    cache.next = response.next;
    cache.previous = response.previous;
  } else {
    const fetchedItemsIDs = response.results.map((item) => item.id);
    cache.results = cache.results.filter((item) => !fetchedItemsIDs.includes(item.id));

    if (arg.cursor === cache.nextCursor) {
      cache.results.push(...response.results);
      cache.next = response.next;
    }

    if (arg.cursor === cache.previousCursor) {
      cache.results.unshift(...response.results);
      cache.previous = response.previous;
    }
  }
};
