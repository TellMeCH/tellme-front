import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import LogoFullSVG from '../assets/logo-full.svg';
import LogoShortSVG from '../assets/logo-short.svg';

export type LogoType = 'full' | 'short';

export interface LogoProps {
  width?: number;
  height?: number;
  type?: LogoType;
}

export function Logo({ width, height, type = 'full' }: LogoProps): ReactElement {
  const t = useTranslations('web-shared.UI_KIT.LOGO');

  const isShort = type === 'short';
  const logoSrc = isShort ? LogoShortSVG : LogoFullSVG;

  return <Image src={logoSrc} alt={t('TEXT_ALT_LOGO')} width={width ?? (isShort ? 44 : 206)} height={height ?? 44} />;
}
