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
  StarIcon,
  CreditCard,
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

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Clients",
      icon: Users,
      submenu: [
        { name: "Add Client", path: "/dashboard/clients/add", icon: UserPlus },
        { name: "All Clients", path: "/dashboard/clients", icon: Users },
      ],
    },
    {
      name: "Invoices",
      icon: FileText,
      submenu: [
        { name: "Create Invoice", path: "/dashboard/invoices/create", icon: FilePlus2 },
        { name: "All Invoices", path: "/dashboard/invoices", icon: FileText },
        { name: "Recurring", path: "/dashboard/invoices/recurring", icon: Repeat },
      ],
    },
    {
      name: "Accounting",
      path: "/dashboard/accounting",
      icon: Calculator,
    },
    {
      name: "Reports",
      path: "/dashboard/reports",
      icon: BarChart3,
    },
    {
      name: "AI Generator",
      path: "/dashboard/ai-generator",
      icon: Sparkles,
    },
    {
      name: "My Subscription",
      path: "/dashboard/subscription",
      icon: CreditCard,
    },
  ];

  return (
    <aside
      className="
        fixed top-0 left-0 
        h-screen w-64 
        bg-[#111111]/95 
        border-r border-white/10 
        text-white 
        flex flex-col 
        justify-between 
        shadow-xl shadow-indigo-500/10 
        z-40
      "
    >
      {/* Scrollable content */}
      <div className="flex flex-col flex-1 overflow-y-auto py-8 px-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <img
            src="invoicelogo.png"
            alt="BillForgeAI"
            className="w-10 h-10 rounded-full"
          />
          <h2 className="text-sm font-semibold mt-2 text-[#80FFF9]">
            BillForgeAI
          </h2>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 text-sm">
          {navLinks.map((item, index) => (
            <div key={index}>
              {!item.submenu ? (
                <NavLink
                  to={item.path}
                  end
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200 ${
                      isActive
                        ? "bg-[#80FFF9]/15 text-[#80FFF9]"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span>{item.name}</span>
                </NavLink>
              ) : (
                <>
                  <button
                    onClick={() => toggleMenu(item.name.toLowerCase())}
                    className="flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </div>
                    {openMenu[item.name.toLowerCase()] ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                  </button>

                  {openMenu[item.name.toLowerCase()] && (
                    <div className="ml-8 mt-1 flex flex-col border-l border-white/10 pl-3">
                      {item.submenu.map((sub, i) => (
                        <NavLink
                          key={i}
                          to={sub.path}
                          end
                          className={({ isActive }) =>
                            `flex items-center gap-2 px-2 py-2 rounded-md transition-all duration-200 ${
                              isActive
                                ? "text-[#80FFF9]"
                                : "text-gray-400 hover:text-white"
                            }`
                          }
                        >
                          <sub.icon size={16} />
                          <span className="text-sm">{sub.name}</span>
                        </NavLink>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </div>

      {/* Back Button */}
      <div className="relative px-4 mb-4 group">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-[#80FFF9]/15 text-gray-300 hover:text-[#80FFF9] py-2 rounded-md transition-all relative"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
