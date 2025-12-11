import { useTranslations } from 'next-intl';

export const useFormatCallDuration = (): typeof formatCallDuration => {
  const t = useTranslations('customer-experience.DETAILS');

  const formatCallDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes} ${t('TEXT_MINUTES')} ${remainingSeconds} ${t('TEXT_SECONDS')}`;
  };

  return formatCallDuration;
};
