import React, { useState } from "react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  FileText,
  FilePlus2,
  Repeat,
  Calculator,
  BarChart3,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Sparkles,
  CreditCard,
  Calendar1Icon,
  SettingsIcon,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const [openMenu, setOpenMenu] = useState({
    clients: false,
    invoices: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <aside
      className="fixed top-0 left-0 h-screen w-64 bg-[#111111]/95 border-r border-white/10 text-white flex flex-col justify-between shadow-xl shadow-indigo-500/10 z-40">

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-600/10 blur-3xl rounded-full" />
          <div className="absolute top-1/3 -right-16 w-52 h-52 bg-indigo-600/10 blur-3xl rounded-full" />
          <div className="absolute bottom-10 -left-16 w-48 h-48 bg-indigo-600/10 blur-3xl rounded-full" />
        </div>
      {/* Scrollable content */}
      <div className="flex flex-col flex-1 overflow-y-auto py-7 px-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
      

        {/* Logo */}
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-3 px-2">
            <img src="invoicelogo.png" className="w-9 h-9 rounded-full" />
            <div>
              <p className="font-semibold text-sm">BillForgeAI</p>
              <p className="text-xs text-gray-400">AI-Powered Invoicing</p>
            </div>
          </div>
        </div>

        {/* ===== SECTION: OVERVIEW ===== */}
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2">
          Overview
        </p>

        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md mb-1 transition-all ${
              isActive
                ? "bg-[#80FFF9]/15 text-[#80FFF9]"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <div className="my-5 border-b border-white/10" />

        {/* ===== SECTION: ACCOUNT ===== */}
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2">
          Account
        </p>

        {/* Clients */}
        <button onClick={() => toggleMenu("clients")} className="flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-all">
          <div className="flex items-center gap-3">
            <Users size={18} />
            Clients
          </div>
          {openMenu.clients ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openMenu.clients && (
          <div className="ml-8 mt-1 flex flex-col border-l border-white/10 pl-3">
            <NavLink
              to="/dashboard/clients/add"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded-md ${
                  isActive
                    ? "text-[#80FFF9]"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              <UserPlus size={16} /> Add Client
            </NavLink>

            <NavLink
              to="/dashboard/clients"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded-md ${
                  isActive
                    ? "text-[#80FFF9]"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              <Users size={16} /> All Clients
            </NavLink>
          </div>
        )}

        {/* Invoices */}
        <button
          onClick={() => toggleMenu("invoices")}
          className="mt-2 flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white"
        >
          <div className="flex items-center gap-3">
            <FileText size={18} />
            Invoices
          </div>
          {openMenu.invoices ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {openMenu.invoices && (
          <div className="ml-8 mt-1 flex flex-col border-l border-white/10 pl-3">
            <NavLink
              to="/dashboard/invoices/create"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded-md ${
                  isActive
                    ? "text-[#80FFF9]"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              <FilePlus2 size={16} /> Create Invoice
            </NavLink>

            <NavLink
              to="/dashboard/invoices"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded-md ${
                  isActive
                    ? "text-[#80FFF9]"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              <FileText size={16} /> All Invoices
            </NavLink>

            <NavLink
              to="/dashboard/invoices/recurring"
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-2 rounded-md ${
                  isActive
                    ? "text-[#80FFF9]"
                    : "text-gray-400 hover:text-white"
                }`
              }
            >
              <Repeat size={16} /> Recurring
            </NavLink>
          </div>
        )}

        <div className="my-5 border-b border-white/10" />

        {/* ===== SECTION: ACTIVITY ===== */}
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2">
          Activity
        </p>

        <NavLink
          to="/dashboard/accounting"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive
                ? "bg-[#80FFF9]/15 text-[#80FFF9]"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <Calculator size={18} /> Accounting
        </NavLink>
        

        <NavLink
          to="/dashboard/reports"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive
                ? "bg-[#80FFF9]/15 text-[#80FFF9]"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <BarChart3 size={18} /> Reports
        </NavLink>

        <div className="my-5 border-b border-white/10" />

        {/* ===== SECTION: OTHERS ===== */}
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2">
          Others
        </p>

        <NavLink
          to="/dashboard/ai-generator"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive
                ? "bg-[#80FFF9]/15 text-[#80FFF9]"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <Sparkles size={18} /> AI Generator
        </NavLink>

        <NavLink
          to="/dashboard/subscription"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive
                ? "bg-[#80FFF9]/15 text-[#80FFF9]"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <CreditCard size={18} /> My Subscription
        </NavLink>

        <NavLink
          to="/dashboard/calendar"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive
                ? "bg-[#80FFF9]/15 text-[#80FFF9]"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <Calendar1Icon size={18} /> Calendar
        </NavLink>

        <div className="my-5 border-b border-white/10" />

        {/* ===== SECTION: SETTINGS ===== */}
        <p className="text-[11px] uppercase tracking-wider text-gray-500 mb-2 px-2">
          Settings
        </p>

        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md ${
              isActive
                ? "bg-[#80FFF9]/15 text-[#80FFF9]"
                : "text-gray-300 hover:bg-white/10 hover:text-white"
            }`
          }
        >
          <SettingsIcon size={18} /> Settings
        </NavLink>

      </div>

      {/* Upgrade Card */}
      <div className="px-4 mb-5">
        <div className=" bg-linear-to-br from-[#1a1a1d] via-[#151518] to-[#101014] border border-white/10 rounded-xl p-4 shadow-lg shadow-black/40 relative overflow-hidden">
          {/* Glow circle */}
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-[#80FFF9]/20 blur-2xl rounded-full" />

          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-[#80FFF9]/15 p-2 rounded-md">
              <Sparkles className="text-[#80FFF9]" size={15} />
            </div>

            <div>
              <p className="font-semibold text-sm">Upgrade Your Plan</p>
            </div>
          </div>

          <button onClick={() => navigate("/dashboard/subscription")} className=" mt-2 w-full py-1 text-sm bg-[#80FFF9]/20  hover:bg-[#80FFF9]/30  text-[#80FFF9] border border-[#80FFF9]/20 rounded-lg transition-all">
            Upgrade
          </button>
        
        </div>

      </div>


      {/* Back Button */}
      {/* <div className="px-4 mb-4">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-[#80FFF9]/15 hover:text-[#80FFF9] text-gray-300 py-2 rounded-md transition-all"
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div> */}
    </aside>
  );
};

export default Sidebar;
