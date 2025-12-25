import { useMediaQuery } from '@react-hooks-library/core';

export const useResponsiveLayout = (): typeof result => {
  const isMobile = useMediaQuery(`(max-width: 480px)`);
  const isTablet = useMediaQuery(`(max-width: 768px)`);
  const isTabletMedium = useMediaQuery(`(max-width: 880px)`);
  const isTabletWide = useMediaQuery(`(max-width: 1023px)`);
  const isTabletWider = useMediaQuery(`(max-width: 1150px)`);
  const isDesktopSmall = useMediaQuery(`(max-width: 1240px)`);
  const isDesktop = useMediaQuery(`(max-width: 1440px)`);
  const isDesktopLarge = useMediaQuery(`(max-width: 1700px)`);

  const result = {
    isMobile,
    isTablet,
    isTabletMedium,
    isTabletWide,
    isTabletWider,
    isDesktopSmall,
    isDesktop,
    isDesktopLarge,
  };

  return result;
};
