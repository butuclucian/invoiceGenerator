import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Admin/Sidebar";
import Navbar from "../../components/Admin/Navbar";
import { AnimatePresence, motion } from "framer-motion";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-[#0e0e0e] min-h-screen text-white">
      <div className="hidden md:block">
        <Sidebar />
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div onClick={() => setSidebarOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40 md:hidden"/>
            <Sidebar isMobile closeSidebar={() => setSidebarOpen(false)} />
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col">
        <div className="md:ml-64 sticky top-0 z-30">
          <Navbar openSidebar={() => setSidebarOpen(true)} />
        </div>

        <main className="md:ml-64 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
