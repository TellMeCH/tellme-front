import { useTranslations } from 'next-intl';
import { ToastService } from '../service';

export const useShowUnderDevelopment = (): (() => void) => {
  const t = useTranslations('web-shared');

  return () => ToastService.showInfo(t('TOAST_MESSAGE.TEXT_UNDER_DEVELOPMENT'));
};
