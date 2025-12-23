import { useSelector } from 'react-redux';
import { employeeApi, organizationApi } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';

export function useOrganization(): typeof result {
  const profile = useSelector(authSelectors.profile);
  const {
    data: employeeProfile,
    isLoading: isEmployeeProfileLoading,
    error: employeeProfileError,
  } = employeeApi.useGetProfileQuery(undefined, {
    skip: !profile,
  });
  const {
    data: organization,
    isLoading: isOrganizationLoading,
    error: organizationError,
  } = organizationApi.useGetOrganizationQuery(
    { id: Number(employeeProfile?.organizationId) },
    { skip: !employeeProfile },
  );

  const result = {
    organization,
    isLoading: isEmployeeProfileLoading || isOrganizationLoading,
    error: employeeProfileError || organizationError,
  };

  return result;
}
