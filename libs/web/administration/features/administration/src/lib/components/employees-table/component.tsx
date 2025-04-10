'use client';

import { Spinner, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useShowUnderDevelopment } from '@tellme/shared/ui/toast';
import { Button, Icon } from '@tellme/shared/ui/ui-kit';
import { Employee, employeeApi, useInfiniteSearch } from '@tellme/web/shared/data-access/api';
import { Heading } from '@tellme/web/shared/ui/ui-kit';

export function EmployeesTable(): ReactElement {
  const t = useTranslations('administration.ADMINISTRATION.EMPLOYEES_TABLE');
  const showUnderDevelopment = useShowUnderDevelopment();

  const { data, fetchNextPage } = useInfiniteSearch<Employee>({ api: employeeApi, params: { pageSize: 15 } });

  return (
    <div className='bg-background-secondary rounded-2xl py-6 px-8'>
      <div className='flex justify-between items-center mb-6'>
        <Heading level={2} className='uppercase text-medium'>
          {t('TEXT_EMPLOYEES')}
        </Heading>
        <Button onPress={showUnderDevelopment} startContent={<Icon name='plus' />}>
          {t('BUTTON_ADD_EMPLOYEE')}
        </Button>
      </div>
      <InfiniteScroll
        dataLength={data?.results.length || 0}
        next={fetchNextPage}
        scrollableTarget='main'
        hasMore={!data?.nextCursor}
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
            th: 'text-text-secondary bg-transparent font-normal text-small',
            tr: 'border-b-1 border-b-text-tertiary',
          }}>
          <TableHeader>
            <TableColumn>{t('TEXT_NAME')}</TableColumn>
            <TableColumn>{t('TEXT_ROLE')}</TableColumn>
            <TableColumn>{t('TEXT_AUTH_DATA')}</TableColumn>
          </TableHeader>
          <TableBody items={data?.results || []}>
            {(employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <strong>{employee.user.fullName}</strong>
                  {employee.isOrganizationAdmin && <p className='text-brand-primary mt-1'>{t('TEXT_ADMIN')}</p>}
                </TableCell>
                <TableCell>
                  <div>{t(`ROLE.TEXT_${employee.role.toUpperCase()}`)}</div>
                </TableCell>
                <TableCell>
                  <div className='mb-2'>{employee.user.email}</div>
                  <div className='text-text-secondary'>
                    {t(`AUTH_TYPE.TEXT_${employee.user.authType.toUpperCase()}`)}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </InfiniteScroll>
    </div>
  );
}
