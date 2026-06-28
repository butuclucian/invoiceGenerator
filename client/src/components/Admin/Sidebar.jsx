import React, { useState } from "react";
import {  LayoutDashboard,  Users,  UserPlus,  FileText,  FilePlus2,  Repeat,  Calculator,  BarChart3,  FileSpreadsheet, ChevronDown,  ChevronUp,  Sparkles,  CreditCard,  Calendar1Icon,  SettingsIcon,  X, BarChart4} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Sidebar = ({ isMobile = false, closeSidebar }) => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState({
    clients: false,
    invoices: false,
  });

  const toggleMenu = (menu) =>
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));

  return (
    <motion.aside initial={{ x: isMobile ? "-100%" : 0 }}  animate={{ x: 0 }}  exit={{ x: "-100%" }}  transition={{ duration: 0.35, ease: "easeOut" }}  className={` fixed top-0 left-0  h-screen w-64  bg-[#111111] border-r border-white/10  text-white  flex flex-col justify-between  shadow-xl shadow-black/40  z-20  ${isMobile ? "md:hidden" : ""} `} >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/10 blur-3xl rounded-full" />
        <div className="absolute top-1/3 -right-16 w-52 h-52 bg-indigo-600/10 blur-3xl rounded-full" />
        <div className="absolute bottom-10 -left-16 w-48 h-48 bg-indigo-600/10 blur-3xl rounded-full" />
      </div>

      {isMobile && (
        <button onClick={closeSidebar} className="absolute top-4 right-4 bg-white/10 border border-white/20 p-2 rounded-full hover:bg-white/20 transition z-50" >
          <X size={20} />
        </button>)}

      <div className="flex flex-col flex-1 overflow-y-auto py-7 px-4">
        <div className="flex flex-col mb-10 relative z-20">
          <div className="flex items-center gap-3 px-2">
            <img src="invoicelogo.png" className="w-9 h-9 rounded-full" />
            <div>
              <p className="font-semibold text-sm">InvoiceGenAI</p>
              <p className="text-xs text-gray-400">AI-Powered Invoicing</p>
            </div>
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2 relative z-20">
          Overview
        </p>

        <NavLink to="/dashboard" end className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md mb-1 transition-all relative z-20 ${ isActive ? "bg-[#80FFF9]/15 text-[#80FFF9]" : "text-gray-300 hover:bg-white/10 hover:text-white" }` } >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <div className="my-5 border-b border-white/10 relative z-20" />

        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2 relative z-20">
          Account
        </p>

        <button onClick={() => toggleMenu("clients")} className="flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-all relative z-20" >
          <div className="flex items-center gap-3">
            <Users size={18} />
            Clients
          </div>
          {openMenu.clients ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openMenu.clients && (
          <div className="ml-8 mt-1 flex flex-col border-l border-white/10 pl-3 relative z-20">
            <NavLink to="/dashboard/clients/add" end
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded-md ${
                  isActive ? "text-[#80FFF9]" : "text-gray-400 hover:text-white"}`}>
              <UserPlus size={16} /> Add Client
            </NavLink>

            <NavLink to="/dashboard/clients" end
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded-md ${
                  isActive ? "text-[#80FFF9]" : "text-gray-400 hover:text-white"}`}>
              <Users size={16} /> All Clients
            </NavLink>
          </div>
        )}

        <button onClick={() => toggleMenu("invoices")} className="mt-2 flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white relative z-20" >
          <div className="flex items-center gap-3">
            <FileText size={18} />
            Invoices
          </div>
          {openMenu.invoices ? <ChevronUp /> : <ChevronDown />}
        </button>

        {openMenu.invoices && (
          <div className="ml-8 mt-1 flex flex-col border-l border-white/10 pl-3 relative z-20">
            <NavLink to="/dashboard/invoices/create" end className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-2 rounded-md ${
                isActive ? "text-[#80FFF9]" : "text-gray-400 hover:text-white" }`}>
              <FilePlus2 size={16} /> Create Invoice
            </NavLink>

            <NavLink to="/dashboard/invoices" end className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-2 rounded-md ${
                isActive ? "text-[#80FFF9]" : "text-gray-400 hover:text-white"
              }`
            }>
              <FileText size={16} /> All Invoices
            </NavLink>

            <NavLink to="/dashboard/invoices/recurring" end className={({ isActive }) =>
              `flex items-center gap-2 px-2 py-2 rounded-md ${
                isActive ? "text-[#80FFF9]" : "text-gray-400 hover:text-white"}`}>
              <Repeat size={16} /> Recurring
            </NavLink>
          </div>
        )}

        <div className="my-5 border-b border-white/10 relative z-20" />

        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2 relative z-20">
          Activity
        </p>

        <NavLink to="/dashboard/accounting" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md mb-1 relative z-20 ${ isActive ? "bg-[#80FFF9]/15 text-[#80FFF9]" : "text-gray-300 hover:bg-white/10 hover:text-white" }` } >
          <Calculator size={18} /> Accounting
        </NavLink>

        <NavLink to="/dashboard/reports" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md mb-1 relative z-20 ${ isActive ? "bg-[#80FFF9]/15 text-[#80FFF9]" : "text-gray-300 hover:bg-white/10 hover:text-white" }` } >
          <BarChart3 size={18} /> Reports
        </NavLink>

        <NavLink to="/dashboard/anaf-reports" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md relative z-20 ${ isActive ? "bg-[#80FFF9]/15 text-[#80FFF9]" : "text-gray-300 hover:bg-white/10 hover:text-white" }` } >
          <FileSpreadsheet size={18} /> ANAF Reporting
        </NavLink>

        <div className="my-5 border-b border-white/10 relative z-20" />

        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2 relative z-20">
          Others
        </p>

        <NavLink to="/dashboard/ai-generator" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md relative z ${isActive ? "bg-[#80FFF9]/15 text-[#80FFF9]" : "text-gray-300 hover:bg-white/10 hover:text-white" }`} >
          <Sparkles size={18} /> AI Generator
        </NavLink>

        <NavLink to="/dashboard/ai-insights" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md relative z ${isActive ? "bg-[#80FFF9]/15 text-[#80FFF9]" : "text-gray-300 hover:bg-white/10 hover:text-white" }`} >
          <BarChart4 size={18} /> AI Insights
        </NavLink>

        <NavLink to="/dashboard/subscription" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md relative z ${isActive ? "bg-[#80FFF9]/15 text-[#80FFF9]" : "text-gray-300 hover:bg-white/10 hover:text-white" }`} >
          <CreditCard size={18} /> My Subscription
        </NavLink>

        <NavLink to="/dashboard/calendar" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md relative z ${isActive ? "bg-[#80FFF9]/15 text-[#80FFF9]" : "text-gray-300 hover:bg-white/10 hover:text-white" }`} >
          <Calendar1Icon size={18} /> Calendar
        </NavLink>

        <div className="my-5 border-b border-white/10 relative z-20" />

        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2 relative z-20">
          Settings
        </p>

        <NavLink to="/dashboard/settings" className={({ isActive }) => `flex items-center gap-3 px-4 py-2 rounded-md relative z ${isActive ? "bg-[#80FFF9]/15 text-[#80FFF9]" : "text-gray-300 hover:bg-white/10 hover:text-white" }` }>
          <SettingsIcon size={18} /> Settings
        </NavLink>

      </div>

    </motion.aside>
  );
};

export default Sidebar;