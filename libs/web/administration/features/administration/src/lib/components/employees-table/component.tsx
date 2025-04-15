'use client';

import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, useDisclosure } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Button, Icon } from '@tellme/shared/ui/ui-kit';
import { Employee, employeeApi, useInfiniteSearch } from '@tellme/web/shared/data-access/api';
import { Heading } from '@tellme/web/shared/ui/ui-kit';
import { useAuthTypeTranslation, useEmployeeRoleTranslation } from '../../hooks';
import { EmployeeActions } from '../employee-actions';
import { EmployeeModal } from '../employee-modal';

interface EmployeesTableProps {
  isCreationButtonDisabled?: boolean;
}

export function EmployeesTable({ isCreationButtonDisabled }: EmployeesTableProps): ReactElement {
  const t = useTranslations('administration.ADMINISTRATION.EMPLOYEES_TABLE');
  const translateRole = useEmployeeRoleTranslation();
  const translateAuthType = useAuthTypeTranslation();

  const { isOpen, onOpenChange } = useDisclosure();

  const { data: employeesResponse, fetchNextPage } = useInfiniteSearch<Employee>({
    api: employeeApi,
    params: { pageSize: 15 },
  });
  const { data: employeeProfile } = employeeApi.useGetProfileQuery();

  return (
    <div className='bg-background-secondary rounded-2xl py-6 px-8'>
      <div className='flex justify-between items-center mb-6'>
        <Heading level={2} className='uppercase text-medium'>
          {t('TEXT_EMPLOYEES')}
        </Heading>
        <Button
          onPress={onOpenChange}
          startContent={<Icon name='plus' />}
          disabled={isCreationButtonDisabled}>
          {t('BUTTON_ADD_EMPLOYEE')}
        </Button>
      </div>
      <InfiniteScroll
        dataLength={employeesResponse?.results.length || 0}
        next={fetchNextPage}
        scrollableTarget='main'
        hasMore={!!employeesResponse?.nextCursor}
        className='!overflow-x-hidden'
        loader={
          <div className='flex justify-center py-6'>
            <Spinner />
          </div>
        }>
        <Table
          aria-label={t('TEXT_EMPLOYEES')}
          removeWrapper
          classNames={{
            td: 'text-medium align-top px-0 py-4',
            th: 'text-text-secondary bg-transparent font-normal text-small px-0',
            tr: 'border-b-1 border-b-text-tertiary',
          }}>
          <TableHeader>
            <TableColumn width={240}>{t('TEXT_NAME')}</TableColumn>
            <TableColumn width={180}>{t('TEXT_ROLE')}</TableColumn>
            <TableColumn>{t('TEXT_AUTH_DATA')}</TableColumn>
          </TableHeader>
          <TableBody items={employeesResponse?.results || []}>
            {(employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <strong>{employee.user.fullName}</strong>
                  {employee.isOrganizationAdmin && <p className='text-brand-primary mt-1'>{t('TEXT_ADMIN')}</p>}
                </TableCell>
                <TableCell>
                  <div>{translateRole(employee.role)}</div>
                </TableCell>
                <TableCell className='flex justify-between'>
                  <div>
                    <div className='mb-2'>{employee.user.email}</div>
                    <div className='text-text-secondary'>{translateAuthType(employee.user.authType)}</div>
                  </div>
                  {employeeProfile?.id !== employee.id && <EmployeeActions employee={employee} />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </InfiniteScroll>
      <EmployeeModal isOpen={isOpen} onOpenChange={onOpenChange} />
    </div>
  );
}
