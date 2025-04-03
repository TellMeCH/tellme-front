import { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import { topicApi } from '../api';
import type { PaginationResponse } from '../../common';
import type { Topic, TopicPaginationRequest } from '../models';

interface UseSearchInfiniteTopicsOptions {
  params: TopicPaginationRequest;
  skip?: boolean;
}

type UseSearchInfiniteResult = Omit<ReturnType<typeof topicApi.useSearchInfiniteQuery>, 'data'> & {
  data?: PaginationResponse<Topic>;
  fetchNextPage: () => void;
};

export function useSearchInfiniteTopics({ params, skip }: UseSearchInfiniteTopicsOptions): UseSearchInfiniteResult {
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
