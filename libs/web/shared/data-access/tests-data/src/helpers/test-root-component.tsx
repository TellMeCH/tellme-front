import { User } from 'firebase/auth';
import { PropsWithChildren, ReactElement, ReactNode, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import {
  conversationApi,
  customerApi,
  employeeApi,
  organizationApi,
  topicApi,
} from '@tellme/web/shared/data-access/api';
import { authActions } from '@tellme/web/shared/data-access/auth';
import { store } from '@tellme/web/shared/data-access/store';
import { profile } from '../fixtures';

interface Props extends PropsWithChildren {
  shouldAuthorize?: boolean;
}

function TestApp({ children, shouldAuthorize }: Props): ReactNode {
  const dispatch = useDispatch();

  useEffect(() => {
    if (shouldAuthorize) {
      dispatch(authActions.setProfile(profile as User));
    }

    return () => {
      dispatch(authActions.setProfile(null));
      dispatch(employeeApi.util.resetApiState());
      dispatch(organizationApi.util.resetApiState());
      dispatch(topicApi.util.resetApiState());
      dispatch(customerApi.util.resetApiState());
      dispatch(conversationApi.util.resetApiState());
    };
  }, []);

  return children;
}

export function TestRootComponent({ children, shouldAuthorize }: Props): ReactElement {
  return (
    <Provider store={store}>
      <TestApp shouldAuthorize={shouldAuthorize}>{children}</TestApp>
    </Provider>
  );
}
