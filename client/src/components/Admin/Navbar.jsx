import React from "react";
import { Bell, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { UserButton } from "@clerk/clerk-react";

const Navbar = () => {
  return (
    <nav className=" sticky top-0 flex items-center justify-between px-6 md:px-10 h-16 bg-[#111111]/90 border-b border-white/10 backdrop-blur-xl shadow-lg shadow-indigo-500/5 z-40">


      {/* Middle — Search bar (hidden on small screens) */}
      <div className="hidden md:flex items-center w-full max-w-md bg-white/5 border border-white/10 rounded-full px-4 py-2 ml-10 text-sm font-light focus-within:border-[#80FFF9]/40 transition-all">
        <Search size={16} color="#80FFF9" className="mr-2" />
        <input
            type="text"
            placeholder="Search invoices, clients..."
            className="bg-transparent outline-none text-white placeholder-white/40 w-full border-none focus:ring-0"
        />
       </div>


      {/* Right Side — Actions */}
      <div className="flex items-center gap-5">
        {/* Notifications */}
        <button className="relative hover:bg-white/10 rounded-full p-2 transition-all">
          <Bell size={20} color="#80FFF9" />
          <span className="absolute top-1 right-1 bg-red-500 w-2 h-2 rounded-full animate-pulse"></span>
        </button>

        {/* Profile (Clerk) */}
        <div className="flex items-center">
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
            afterSignOutUrl="/"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
