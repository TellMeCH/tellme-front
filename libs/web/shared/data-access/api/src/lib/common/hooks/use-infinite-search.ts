import { ThunkAction, ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { BaseEntity, PaginationRequest, PaginationResponse } from '../models';

interface UseInfiniteSearchOptions<TEntity extends BaseEntity, TRequest extends PaginationRequest = PaginationRequest> {
  api: {
    useSearchInfiniteQuery: (
      params: TRequest,
      options: { skip?: boolean },
    ) => { data?: PaginationResponse<TEntity>; isFetching: boolean; isLoading: boolean };
    endpoints: {
      searchInfinite: {
        initiate: (params: TRequest, options: { forceRefetch?: boolean }) => ThunkAction<any, any, any, UnknownAction>;
      };
    };
  };
  params: TRequest;
  skip?: boolean;
}

export function useInfiniteSearch<TEntity extends BaseEntity, TRequest extends PaginationRequest = PaginationRequest>({
  api,
  params,
  skip,
}: UseInfiniteSearchOptions<TEntity, TRequest>): typeof result {
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const queryResult = api.useSearchInfiniteQuery(params, { skip });
  const { data, isFetching } = queryResult;

  const fetchNextPage = (): void => {
    if (data?.nextCursor && !isFetching) {
      dispatch(api.endpoints.searchInfinite.initiate({ ...params, cursor: data.nextCursor }, { forceRefetch: true }));
    }
  };

  const result = {
    ...queryResult,
    fetchNextPage,
  };

  return result;
}
