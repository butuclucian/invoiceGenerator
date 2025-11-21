import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const dashboardRoutes = [
      "/dashboard",
      "/clients",
      "/clients/add",
      "/invoices",
      "/invoices/create",
      "/invoices/recurring",
      "/accounting",
      "/reports",
      "/ai",
    ];

    if (dashboardRoutes.some((path) => pathname.startsWith(path))) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
