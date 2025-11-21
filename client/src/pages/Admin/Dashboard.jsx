import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import Navbar from "../../components/Admin/Navbar";
import AIChatPanel from "../../components/Admin/AIChatPanel";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#0e0e0e] min-h-screen text-white">

      {/* SIDEBAR DESKTOP */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* SIDEBAR MOBILE */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* overlay */}
            <motion.div
              onClick={() => setSidebarOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40 md:hidden"
            />

            {/* mobile sidebar */}
            <Sidebar isMobile closeSidebar={() => setSidebarOpen(false)} />
          </>
        )}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col relative">

        {/* NAVBAR FIX — moves right on desktop */}
        <div className="md:ml-64 fixed top-0 left-0 right-0 z-30">
          <Navbar openSidebar={() => setSidebarOpen(true)} />
        </div>

        {/* PAGE CONTENT */}
        <main className="pt-24 p-6 overflow-y-auto md:ml-64">
          <Outlet />
        </main>

        <AIChatPanel />
      </div>
    </div>
  );
};

export default Dashboard;
