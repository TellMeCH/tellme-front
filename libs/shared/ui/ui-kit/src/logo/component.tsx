import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import LogoDarkSVG from '../assets/logo-dark.svg';
import LogoLightSVG from '../assets/logo-light.svg';

export type LogoType = 'dark' | 'light';

export interface LogoProps {
  width?: number;
  height?: number;
  type?: LogoType;
  className?: string;
}

export function Logo({ width, height, type = 'dark', className }: LogoProps): ReactElement {
  const t = useTranslations('shared.UI_KIT.LOGO');

  const isLight = type === 'light';
  const logoSrc = isLight ? LogoLightSVG : LogoDarkSVG;
  const logoWidth = width ?? (isLight ? 115 : 206);
  const logoHeight = height ?? (isLight ? 37 : 44);

  return <Image
    src={logoSrc}
    alt={t('TEXT_ALT_LOGO')}
    width={logoWidth}
    height={logoHeight}
    className={className} />;
}
