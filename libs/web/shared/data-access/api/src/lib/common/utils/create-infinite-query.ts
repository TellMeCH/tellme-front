import { prepareRequestParams } from '@ronas-it/rtkq-entity-api';
import { ClassConstructor } from 'class-transformer';
import { PaginationRequest } from '../models';

interface InfiniteQueryParams<TRequest extends PaginationRequest = PaginationRequest> {
  queryArg: TRequest;
  pageParam?: string;
}

export const createInfiniteQuery = <TRequest extends PaginationRequest = PaginationRequest>(
  baseEndpoint: string,
  requestConstructor: ClassConstructor<TRequest>,
): typeof result => {
  const result = ({ queryArg, pageParam }: InfiniteQueryParams<TRequest>) => ({
    method: 'get',
    url: baseEndpoint,
    params: prepareRequestParams({ ...queryArg, cursor: pageParam }, requestConstructor),
  });

  return result;
};
