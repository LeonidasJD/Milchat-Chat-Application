import { useState, useEffect } from 'react';

const useMediaQuery = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const checkMediaQuery = () => {
    const mobileQuery = window.matchMedia('(max-width: 767px)');
    const tabletQuery = window.matchMedia(
      '(min-width: 768px) and (max-width: 1024px)'
    );
    const desktopQuery = window.matchMedia('(min-width: 1025px)');

    setIsMobile(mobileQuery.matches);
    setIsTablet(tabletQuery.matches);
    setIsDesktop(desktopQuery.matches);
  };

  useEffect(() => {
    checkMediaQuery();
    window.addEventListener('resize', checkMediaQuery);

    return () => {
      window.removeEventListener('resize', checkMediaQuery);
    };
  }, []);

  return { isMobile, isTablet, isDesktop };
};

export default useMediaQuery;