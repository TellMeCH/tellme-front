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
    const haveItemsOwnIDs = !!response.results[0].id;
    const fetchedItemsIDs = response.results.map((item) => (haveItemsOwnIDs ? item.id : item.idFromUrl));
    cache.results = cache.results.filter(
      (item) => !fetchedItemsIDs.includes(haveItemsOwnIDs ? item.id : item.idFromUrl),
    );

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
