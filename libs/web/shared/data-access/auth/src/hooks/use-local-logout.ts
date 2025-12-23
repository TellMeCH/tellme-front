import { useDispatch } from 'react-redux';
import {
  conversationApi,
  customerApi,
  employeeApi,
  organizationApi,
  topicApi,
} from '@tellme/web/shared/data-access/api';
import { CookieService } from '@tellme/web/shared/data-access/cookies';

export function useLocalLogout(): typeof logoutLocally {
  const dispatch = useDispatch();

  const logoutLocally = (): void => {
    CookieService.remove(['isAuthenticated', 'isOrganizationAdmin', 'persistence']);
    dispatch(topicApi.util.resetApiState());
    dispatch(organizationApi.util.resetApiState());
    dispatch(employeeApi.util.resetApiState());
    dispatch(customerApi.util.resetApiState());
    dispatch(conversationApi.util.resetApiState());
  };

  return logoutLocally;
}
