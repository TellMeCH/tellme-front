import { useTranslations } from 'next-intl';
import { EmployeeAuthType } from '@tellme/web/shared/data-access/api';

export function useAuthTypeTranslation(): typeof result {
  const t = useTranslations('administration.ADMINISTRATION.AUTH_TYPE');

  const result = (authType: EmployeeAuthType): string => {
    return t(`TEXT_${authType.toUpperCase()}`);
  };

  return result;
}
