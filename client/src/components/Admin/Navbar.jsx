import React, { useEffect, useState, useRef } from "react";
import { Bell, X, Check, LogOut, ArrowLeft, Settings, Search, User2, MessageSquare, Menu } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import API from "../../utils/api";
import { useSearchStore } from "../../store/useSearchStore";
import { useNavigate } from "react-router-dom";

const Navbar = ({ openSidebar }) => {
  const navigate = useNavigate();
  const { query, setQuery } = useSearchStore();
  
  const popupRef = useRef(null);
  const userMenuRef = useRef(null);
  
  const [notifications, setNotifications] = useState([]);
  const [hasUnread, setHasUnread] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const currentPlan = subscription?.plan || "Free";


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await API.get("/auth/profile");
        setUserData(data);
      } catch {}
    };
    fetchUser();
  }, []);


  useEffect(() => {
    const fetchSub = async () => {
      try {
        const { data } = await API.get("/subscription/me");
        setSubscription(data);
      } catch {}
    };
    fetchSub();
  }, []);


  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        await API.get("/notifications/generate");
      } catch (e) {}

      const sysRes = await API.get("/notifications");
      let allNotifications = Array.isArray(sysRes.data) ? [...sysRes.data] : [];

      const invRes = await API.get("/invoices");
      const invoicesList = Array.isArray(invRes.data) ? invRes.data : [];
      
      const aiPendingInvoices = invoicesList.filter(inv => inv.status === 'pending');

      const aiNotifications = aiPendingInvoices.map(inv => ({
        _id: `ai-${inv._id}`,
        isAiGenerated: true,
        read: false,
        message: "Factură nouă extrasă automat din email",
        invoice: inv
      }));

      const combined = [...aiNotifications, ...allNotifications];

      setNotifications(combined);
      setHasUnread(combined.some((n) => !n.read));
    } catch (error) {
      console.error("Eroare la sincronizarea notificărilor în Navbar:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);


  const handleMarkAsRead = async () => {
    try {
      await API.put("/notifications/mark-read", {});
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setHasUnread(false);
      toast.success("Toate notificările au fost marcate ca citite!");
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* NAVBAR */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          fixed top-0 
          h-20 
          z-30 
          px-4 sm:px-6 md:px-8 
          flex items-center justify-between 
          border-b border-white/10 
          bg-[#0d0d0d]/80 backdrop-blur-xl

          w-full
          md:w-[calc(100%-16rem)]
          md:left-64
        "
      >
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-indigo-600/20 blur-3xl rounded-full" />
        </div>

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 relative z-20">
          {/* MOBILE MENU */}
          <button
            className="md:hidden p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10"
            onClick={openSidebar}
          >
            <Menu className="text-[#80FFF9]" size={22} />
          </button>

          {/* GO HOME */}
          <button
            onClick={() => navigate(-1)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10"
          >
            <ArrowLeft size={18} className="text-[#80FFF9]" />
            <span className="text-sm text-gray-200">Back</span>
          </button>
        </div>

        {/* SEARCH (DESKTOP) */}
        <div className="hidden md:flex relative z-20">
          <div className="flex items-center bg-white/5 px-4 py-2 rounded-full border border-white/10 w-72 hover:bg-white/10">
            <Search size={18} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search invoices, clients..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-transparent w-full outline-none ml-3 text-gray-200 text-sm"
            />
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 md:gap-6 relative z-20">
          {/* NOTIFICATIONS */}
          <div className="relative" ref={popupRef}>
            <button
              onClick={() => setShowPopup(!showPopup)}
              className="relative bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/10 transition"
            >
              <Bell size={20} className="text-[#80FFF9]" />
              {hasUnread && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </button>

            <AnimatePresence>
              {showPopup && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="
                    absolute mt-3
                    sm:right-0 right-1/2 sm:left-auto left-1/2
                    -translate-x-1/2 sm:translate-x-0
                    w-[85vw] sm:w-85
                    bg-[#151515]/95 border border-white/10 rounded-2xl
                    backdrop-blur-xl shadow-2xl z-50 p-1
                  "
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white">Notifications</h3>
                      <span className="text-[10px] bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full font-medium">
                        {notifications.length} active
                      </span>
                    </div>

                    {notifications.some((n) => !n.read && !n.isAiGenerated) && (
                      <button
                        onClick={handleMarkAsRead}
                        className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-[#80FFF9] transition"
                      >
                        <Check size={14} /> Mark all read
                      </button>
                    )}

                    <button
                      onClick={() => setShowPopup(false)}
                      className="text-gray-400 hover:text-white transition"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-64 overflow-y-auto mt-1 space-y-0.5">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-xs">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((note) => (
                        <button
                          key={note._id}
                          onClick={() => {
                            if (note.invoice?._id) {
                              // Ruta corectă de dashboard folosită în aplicația ta
                              navigate(`/dashboard/invoices/${note.invoice._id}`);
                              setShowPopup(false);
                            }
                          }}
                          className={`w-full text-left p-4 border-b border-white/5 hover:bg-white/5 rounded-xl transition flex flex-col gap-1 ${
                            note.isAiGenerated ? "border-l-2 border-l-amber-500 bg-amber-500/5" : (!note.read && "bg-white/5")
                          }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <p className={`text-sm font-medium ${note.isAiGenerated ? "text-amber-400" : "text-[#80FFF9]"}`}>
                              {note.message}
                            </p>
                            {note.isAiGenerated && (
                              <span className="text-[9px] font-mono uppercase bg-amber-400/10 text-amber-400 px-1.5 py-0.5 rounded border border-amber-400/20 tracking-wider">
                                Review AI
                              </span>
                            )}
                          </div>

                          {note.invoice && (
                            <div className="mt-1 space-y-0.5 text-xs text-gray-400">
                              <p>Invoice: <span className="text-gray-200 font-mono">{note.invoice.invoice_number}</span></p>
                              <p>Client: <span className="text-gray-200 font-medium">{note.invoice.client?.name || "Unknown"}</span></p>
                              <p>Amount: <span className="text-teal-400 font-medium">${Number(note.invoice.total).toFixed(2)}</span></p>
                            </div>
                          )}
                          
                          {note.isAiGenerated && (
                            <span className="text-[10px] text-gray-500 mt-1 italic">Click pentru a verifica și aproba datele fiscale</span>
                          )}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* USER MENU */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 sm:gap-3 bg-white/5 px-3 sm:px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition"
            >
              <User2 className="text-[#80FFF9]" size={20} />

              <span
                className={`text-[10px] sm:text-xs px-2 py-1 rounded-full border ${
                  currentPlan === "Pro"
                    ? "text-[#80FFF9] border-[#80FFF9]/40 bg-[#80FFF9]/10"
                    : currentPlan === "Enterprise"
                    ? "text-[#CB52D4] border-[#CB52D4]/40 bg-[#CB52D4]/10"
                    : "text-gray-300 border-white/10 bg-white/5"
                }`}
              >
                {currentPlan}
              </span>
            </button>

            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="
                    absolute mt-3 
                    right-2 sm:right-0 
                    w-[65vw] sm:w-64 
                    bg-[#151515]/95 border border-white/10 
                    rounded-xl shadow-xl backdrop-blur-xl p-5 z-50
                  "
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center">
                      <User2 size={26} className="text-[#80FFF9]" />
                    </div>

                    <div>
                      <p className="text-white font-medium text-sm">
                        {userData?.name || "Unnamed User"}
                      </p>
                      <p className="text-gray-400 text-xs">{userData?.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => (window.location.href = "/dashboard/settings")}
                    className="w-full flex items-center gap-2 px-2 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition"
                  >
                    <Settings size={16} /> Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-2 py-2 mt-1 text-red-400 hover:bg-red-600/20 rounded-md transition"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.nav>
    </>
  );
};

export default Navbar;