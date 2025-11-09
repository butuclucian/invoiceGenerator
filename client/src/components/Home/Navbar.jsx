import React, { useState, useEffect } from "react";
import { Menu, X, FileText, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check JWT token on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  // Sticky scroll
  useEffect(() => {
    const handleScroll = () => setIsSticky(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };

  return (
    <header
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center justify-between w-[90%] md:w-[80%] px-6 py-3 md:py-4 rounded-full border transition-all duration-300 ${
        isSticky
          ? "bg-[#1e1e1e]/90 border-white/10 backdrop-blur-xl shadow-lg shadow-indigo-500/10 scale-[1.01]"
          : "bg-[#212121]/70 border-white/5 backdrop-blur-md"
      }`}
    >
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2">
        <img
          src="https://cdn-icons-png.flaticon.com/512/9429/9429026.png"
          alt="BillForge Logo"
          className="w-8 h-8"
        />
        <span className="text-white font-semibold tracking-wide hidden sm:inline">
          BillForge<span className="text-[#80FFF9]">AI</span>
        </span>
      </Link>

      {/* Desktop Menu */}
      <nav className="hidden md:flex items-center gap-8 text-white/80 text-md font-light">
        <Link to="/" className="hover:text-[#80FFF9] transition-all">
          Home
        </Link>
        <a href="#features" className="hover:text-[#80FFF9] transition-all">
          Features
        </a>

        {/* ✅ New Pricing/Subscriptions link */}
        <a href="#pricing" className="hover:text-[#80FFF9] transition-all">
          Pricing
        </a>
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* ✅ Auth buttons */}
        {!isLoggedIn ? (
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 text-sm text-[#80FFF9] border border-white/10 rounded-md hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 text-sm text-[#80FFF9] border border-white/10 rounded-md hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 text-sm text-[#80FFF9] border border-white/10 rounded-md hover:bg-white/10 hover:text-white transition-all flex items-center gap-1"
            >
              <FileText size={15} />
              Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 rounded-md bg-[#1a1a1a] border border-white/10 hover:bg-red-600/80 hover:text-white transition-all"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-[#80FFF9]"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute top-[68px] right-0 bg-[#1a1a1a]/95 backdrop-blur-xl border border-white/10 w-full rounded-2xl py-6 flex flex-col items-center gap-6 text-white text-sm font-light transition-all duration-300 ${
          menuOpen
            ? "opacity-100 translate-y-0 visible"
            : "opacity-0 -translate-y-5 invisible"
        }`}
      >
        <Link
          to="/"
          onClick={() => setMenuOpen(false)}
          className="hover:text-[#80FFF9] transition-all"
        >
          Home
        </Link>
        <a
          href="#features"
          onClick={() => setMenuOpen(false)}
          className="hover:text-[#80FFF9] transition-all"
        >
          Features
        </a>

        {/* ✅ New Pricing link in mobile menu */}
        <a
          href="#pricing"
          onClick={() => setMenuOpen(false)}
          className="hover:text-[#80FFF9] transition-all"
        >
          Pricing
        </a>


        {/* Mobile Auth Section */}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="w-[80%] text-center border border-white/20 text-white py-2 rounded-md hover:bg-white/10 transition-all"
            >
              Login
            </Link>
            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="w-[80%] text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded-md hover:opacity-90 transition-all"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center gap-3">
              <div className="bg-white/5 border border-white/10 rounded-full w-10 h-10 flex items-center justify-center">
                <User size={18} color="#80FFF9" />
              </div>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/dashboard");
                }}
                className="text-[#80FFF9] text-sm border border-white/10 px-5 py-2 rounded-md hover:bg-white/10 transition-all"
              >
                Dashboard
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 px-5 py-2 text-sm border border-white/10 rounded-md hover:bg-red-600/80 transition-all"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Navbar;
