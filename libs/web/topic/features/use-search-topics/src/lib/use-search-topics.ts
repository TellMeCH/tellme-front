import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { topicApi } from '@tellme/web/shared/data-access/api';
import type { TopicPaginationRequest } from '@tellme/web/shared/data-access/api';

interface UseSearchTopicsOptions {
  params: TopicPaginationRequest;
  skip?: boolean;
}

// TODO: Refactor this type
type UseSearchTopicsResult = ReturnType<typeof topicApi.useSearchInfiniteQuery> & {
  fetchNextPage: () => void;
};

export function useSearchTopics({ params, skip }: UseSearchTopicsOptions): UseSearchTopicsResult {
  const dispatch: ThunkDispatch<any, any, UnknownAction> = useDispatch();

  const queryResult = topicApi.useSearchInfiniteQuery(params, { skip });
  const { data, isFetching } = queryResult;

  const fetchNextPage = (): void => {
    if (data?.nextCursor && !isFetching) {
      dispatch(
        topicApi.endpoints.searchInfinite.initiate({ ...params, cursor: data.nextCursor }, { forceRefetch: true }),
      );
    }
  };

  return {
    ...queryResult,
    fetchNextPage,
  };
}
