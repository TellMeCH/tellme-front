import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ReactElement } from 'react';
import LogoSVG from '../assets/logo.svg';

export interface LogoProps {
  width?: number;
  height?: number;
}

export function Logo({ width = 206, height = 44 }: LogoProps): ReactElement {
  const t = useTranslations('web-shared.UI_KIT.LOGO');

  return <Image src={LogoSVG as unknown as StaticImport} alt={t('TEXT_ALT_LOGO')} width={width} height={height} />;
}
