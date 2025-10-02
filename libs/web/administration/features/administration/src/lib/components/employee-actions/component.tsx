'use client';

import { DropdownItemProps, useDisclosure } from '@heroui/react';
import { compact } from 'lodash';
import { useTranslations } from 'next-intl';
import { ReactElement, useEffect } from 'react';
import { ToastService } from '@tellme/shared/ui/toast';
import { Employee, employeeApi } from '@tellme/web/shared/data-access/api';
import { ConfirmationModal, Dropdown } from '@tellme/web/shared/ui/ui-kit';
import { ToastContent } from '../toast-content';

interface EmployeeActionsProps {
  employee: Employee;
}

export function EmployeeActions({ employee }: EmployeeActionsProps): ReactElement {
  const t = useTranslations('administration.ADMINISTRATION.EMPLOYEE_ACTIONS');
  const { isOpen, onOpenChange } = useDisclosure();

  const [invite, { isSuccess: wasInvitedSuccessfully }] = employeeApi.useInviteMutation();
  const [update, { isSuccess: wasUpdatedSuccessfully, originalArgs }] = employeeApi.useUpdateMutation();
  const [remove, { isLoading: isDeleting }] = employeeApi.useDeleteMutation();

  const inviteEmployee = (): void => {
    invite(employee.id);
  };

  const revokeAdminPermissions = (): void => {
    update({ id: employee.id, isOrganizationAdmin: false });
  };

  const grantAdminPermissions = (): void => {
    update({ id: employee.id, isOrganizationAdmin: true });
  };

  const removeEmployee = (): void => {
    remove(employee.id);
  };

  useEffect(() => {
    if (wasInvitedSuccessfully) {
      ToastService.showSuccess(
        <ToastContent
          title={t('TEXT_INVITATION_SUCCESS_TITLE')}
          description={t.rich('TEXT_INVITATION_SUCCESS_DESCRIPTION', {
            email: employee.user.email,
            highlight: (chunks) => <strong>{chunks}</strong>,
          })}
        />,
      );
    }
  }, [wasInvitedSuccessfully]);

  useEffect(() => {
    if (wasUpdatedSuccessfully) {
      const isAdmin = originalArgs?.isOrganizationAdmin;
      ToastService.showSuccess(
        <ToastContent
          title={t(isAdmin ? 'TEXT_GRANT_SUCCESS_TITLE' : 'TEXT_REVOCATION_SUCCESS_TITLE')}
          description={t.rich(isAdmin ? 'TEXT_GRANT_SUCCESS_DESCRIPTION' : 'TEXT_REVOCATION_SUCCESS_DESCRIPTION', {
            fullName: employee.user.fullName,
            highlight: (chunks) => <strong>{chunks}</strong>,
          })}
        />,
      );
    }
  }, [wasUpdatedSuccessfully]);

  const options: Array<DropdownItemProps> = compact([
    { key: 'resend-invitation', title: t('BUTTON_RESEND_INVITATION'), onPress: inviteEmployee },
    employee.isOrganizationAdmin
      ? { key: 'revoke-permissions', title: t('BUTTON_REVOKE_ADMIN_PERMISSIONS'), onPress: revokeAdminPermissions }
      : { key: 'grant-permissions', title: t('BUTTON_GIVE_ADMIN_PERMISSIONS'), onPress: grantAdminPermissions },
    {
      key: 'delete',
      title: t('BUTTON_DELETE_PROFILE'),
      onPress: onOpenChange,
      classNames: { title: 'text-brand-danger' },
    },
  ]);

  return (
    <div className='mr-1'>
      <Dropdown options={options} testId='employee-actions' />
      <ConfirmationModal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={t('TEXT_CONFIRMATION_MODAL_TITLE')}
        description={t.rich('TEXT_CONFIRMATION_MODAL_DESCRIPTION', {
          fullName: employee.user.fullName,
          highlight: (chunks) => <strong>{chunks}</strong>,
        })}
        onConfirm={removeEmployee}
        confirmationButtonText={t('BUTTON_DELETE')}
        isLoading={isDeleting}
      />
    </div>
  );
}
