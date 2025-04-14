'use client';

import { Spinner } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { Fragment, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Employee, employeeApi, organizationApi, useInfiniteSearch } from '@tellme/web/shared/data-access/api';
import { authSelectors } from '@tellme/web/shared/data-access/auth';
import { Header } from '@tellme/web/shared/ui/ui-kit';
import { EmployeesTable, OrganizationDetail } from './components';

export function Administration(): ReactElement {
  const t = useTranslations('administration.ADMINISTRATION');

  const profile = useSelector(authSelectors.profile);
  const { data: employeeProfile, isLoading: isEmployeeProfileLoading } = employeeApi.useGetProfileQuery(undefined, {
    skip: !profile,
  });
  const { data: organization, isLoading: isOrganizationLoading } = organizationApi.useGetOrganizationQuery(
    { id: Number(employeeProfile?.organizationId) },
    { skip: !employeeProfile },
  );
  const { data: employeesResponse, isLoading: areEmployeesLoading } = useInfiniteSearch<Employee>({
    api: employeeApi,
    params: { pageSize: 15 },
    skip: !profile,
  });

  const isLoading = isOrganizationLoading || isEmployeeProfileLoading || areEmployeesLoading;

  return (
    <div className='min-h-full flex flex-col gap-2 justify-center'>
      {isLoading || !organization || !employeesResponse ? (
        <Spinner />
      ) : (
        <Fragment>
          <Header title={t('TEXT_TITLE', { organizationName: organization.name.toUpperCase() || '' })} />
          <div className='flex gap-2'>
            <OrganizationDetail name={t('TEXT_REGISTERED_EMPLOYEES')} value={organization.employeesCount || 0} />
            <OrganizationDetail name={t('TEXT_MAX_ACCOUNTS_COUNT')} value={organization.maxUsersCount || 0} />
            <OrganizationDetail name={t('TEXT_CONVERSATIONS_COUNT')} value={organization.conversationsCount || 0} />
          </div>
          <EmployeesTable isCreationButtonDisabled={organization.maxUsersCount <= organization.employeesCount} />
        </Fragment>
      )}
    </div>
  );
}
