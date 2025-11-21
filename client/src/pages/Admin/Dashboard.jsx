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

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* ==== OVERLAY CLICK TO CLOSE ==== */}
            <motion.div onClick={() => setSidebarOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40 md:hidden" />

            {/* ==== SIDEBAR MOBILE ==== */}
            <Sidebar
              isMobile
              closeSidebar={() => setSidebarOpen(false)}
            />
          </>
        )}
      </AnimatePresence>

      {/* CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col relative">

        <div className="pt-20">
          <Navbar openSidebar={() => setSidebarOpen(true)} />

          <main className="p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>

        <AIChatPanel />
      </div>
    </div>
  );
};

export default Dashboard;
