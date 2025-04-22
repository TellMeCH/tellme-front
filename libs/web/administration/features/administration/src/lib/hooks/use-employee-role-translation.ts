import { useTranslations } from 'next-intl';
import { EmployeeRole } from '@tellme/web/shared/data-access/api';

export function useEmployeeRoleTranslation(): typeof result {
  const t = useTranslations('administration.ADMINISTRATION.ROLE');

  const result = (role: EmployeeRole): string => {
    return t(`TEXT_${role.toUpperCase()}`).toUpperCase();
  };

  return result;
}
