import { useMediaQuery } from '@react-hooks-library/core';
import breakpoints from './styles.module.scss';

export const useResponsiveLayout = () => {
  const isMobile = useMediaQuery(`(max-width: ${breakpoints.mobile})`);
  const isTablet = useMediaQuery(`(max-width: ${breakpoints.tablet})`);
  const isTabletMedium = useMediaQuery(`(max-width: ${breakpoints.tabletMedium})`);
  const isTabletWide = useMediaQuery(`(max-width: ${breakpoints.tabletWide})`);
  const isTabletWider = useMediaQuery(`(max-width: ${breakpoints.tabletWider})`);
  const isDesktopSmall = useMediaQuery(`(max-width: ${breakpoints.desktopSmall})`);
  const isDesktop = useMediaQuery(`(max-width: ${breakpoints.desktop})`);
  const isDesktopLarge = useMediaQuery(`(max-width: ${breakpoints.desktopLarge})`);

  return {
    isMobile,
    isTablet,
    isTabletMedium,
    isTabletWide,
    isTabletWider,
    isDesktopSmall,
    isDesktop,
    isDesktopLarge,
  };
};
