import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const Navbar2 = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/'; // Verificăm dacă suntem pe Home
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Dacă NU suntem pe Home, e vizibil din start. Altfel, pornește ascuns.
  const [isVisible, setIsVisible] = useState(!isHomePage); 

  const { scrollY } = useScroll();

  // Resetăm vizibilitatea automat când utilizatorul schimbă pagina
  useEffect(() => {
    if (isHomePage) {
      // Dacă se întoarce pe Home, verificăm unde se află cu scroll-ul
      setIsVisible(window.scrollY > window.innerHeight * 0.8);
    } else {
      // Pe orice altă pagină, arată navbar-ul imediat
      setIsVisible(true);
    }
    setMobileMenuOpen(false); // Închidem meniul pe mobil la navigare
  }, [location.pathname, isHomePage]);

  // Logica de scroll se aplică DOAR dacă suntem pe Home page
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (isHomePage) {
      if (latest > window.innerHeight * 0.8) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setMobileMenuOpen(false);
      }
    }
  });

  const navLinks = [
    { name: "About", path: "/about" },
    { name: "Templates", path: "/templates" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact", path: "/contact" }
  ];

  return (
    <>
      <motion.nav 
        initial={{ y: isVisible ? 0 : "-100%" }}
        animate={{ y: isVisible ? 0 : "-100%" }}
        transition={{ duration: 0.5, ease: [0.215, 0.61, 0.355, 1.0] }}
        className="fixed top-0 left-0 w-full h-20 bg-[#E8E8E8] border-b-2 border-[#1E1E1E] z-50 flex"
      >
        {/* COMPARTIMENT 1: Logo */}
        <div className="flex-none flex items-center px-6 md:px-10 border-r-2 border-[#1E1E1E] h-full bg-[#E8E8E8] hover:bg-[#1E1E1E] transition-colors duration-300 group">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <div className="w-10 h-10 bg-[#1E1E1E] group-hover:bg-[#E8E8E8] transition-colors rounded-none flex items-center justify-center">
              <span className="text-[#E8E8E8] group-hover:text-[#1E1E1E] font-black text-xl tracking-tighter">
                iG
              </span>
            </div>
            <span className="font-bold text-xl tracking-tight text-[#1E1E1E] group-hover:text-[#E8E8E8] hidden sm:block transition-colors">
              invoiceGenAi<span className="text-purple-600">.</span>
            </span>
          </Link>
        </div>

        {/* COMPARTIMENT 2: Links */}
        <div className="flex-1 hidden lg:flex items-center justify-center h-full">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative h-full flex items-center px-10 text-sm font-black uppercase tracking-widest transition-all duration-300 border-x border-transparent hover:border-[#1E1E1E] overflow-hidden group ${
                  isActive ? "text-[#E8E8E8]" : "text-[#1E1E1E]"
                }`}
              >
                <div 
                  className={`absolute inset-0 transition-transform duration-300 origin-bottom -z-10 ${
                    isActive ? "bg-[#1E1E1E] scale-y-100" : "bg-[#1E1E1E] scale-y-0 group-hover:scale-y-100"
                  }`} 
                />
                <span className={`relative z-10 transition-colors duration-300 ${isActive ? "text-[#E8E8E8]" : "group-hover:text-[#E8E8E8]"}`}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* COMPARTIMENT 3: Action Button & Mobile Toggle */}
        <div className="flex-none flex items-center border-l-2 border-[#1E1E1E] h-full ml-auto lg:ml-0">
          <Link
            to="/register"
            className="hidden lg:flex items-center justify-center h-full px-10 bg-[#E8E8E8] text-[#1E1E1E] hover:bg-purple-400 hover:text-[#1E1E1E] transition-colors font-black uppercase tracking-widest text-sm"
          >
            Start Free →
          </Link>

          {/* Hamburger Menu */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden h-full px-8 flex flex-col justify-center items-center gap-1.5 hover:bg-[#1E1E1E] hover:text-[#E8E8E8] group transition-colors"
          >
            <span className={`w-6 h-0.5 bg-[#1E1E1E] group-hover:bg-[#E8E8E8] transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-[#1E1E1E] group-hover:bg-[#E8E8E8] transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`w-6 h-0.5 bg-[#1E1E1E] group-hover:bg-[#E8E8E8] transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </motion.nav>

      {/* Fullscreen Brutalist Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && isVisible && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "100vh" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.6, ease: [0.215, 0.61, 0.355, 1.0] }}
            className="fixed top-20 left-0 w-full bg-[#1E1E1E] z-40 overflow-hidden flex flex-col border-b-2 border-[#1E1E1E]"
          >
            <div className="flex flex-col h-full w-full">
              {navLinks.map((link, index) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center border-b border-[#E8E8E8]/20 text-[#E8E8E8] text-4xl sm:text-6xl font-black uppercase tracking-tighter hover:bg-[#E8E8E8] hover:text-[#1E1E1E] transition-colors"
                >
                  <motion.span
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    {link.name}
                  </motion.span>
                </Link>
              ))}
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 flex items-center justify-center bg-purple-500 text-[#1E1E1E] text-4xl sm:text-6xl font-black uppercase tracking-tighter hover:bg-purple-400 transition-colors"
              >
                Start Free →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar2;