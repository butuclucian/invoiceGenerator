import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Forțează scroll-ul la începutul paginii (0,0) la fiecare schimbare de rută
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // Componenta nu randează nimic vizual
};

export default ScrollToTop;