import React, { useEffect, useState, useRef } from "react";
import { Bell, X, Check, LogOut, ArrowLeft, Settings, Search, User2, MessageSquare, Menu,} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import API from "../../utils/api";
import { useAIChatStore } from "../../store/useAIChatStore";
import { useSearchStore } from "../../store/useSearchStore";

const Navbar = ({ openSidebar }) => {
  const { isOpen: aiOpen, toggleChat } = useAIChatStore();

  const popupRef = useRef(null);
  const userMenuRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const { query, setQuery } = useSearchStore();

  // FETCH USER
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData(data);
      } catch {}
    };
    fetchUser();
  }, []);

  // FETCH SUB
  useEffect(() => {
    const fetchSub = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/subscription/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscription(data);
      } catch {}
    };
    fetchSub();
  }, []);

  const currentPlan = subscription?.plan || "Free";

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await API.get("/notifications/generate", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const { data } = await API.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(data);
      setHasUnread(data.some((n) => !n.read));

      const newCount = data.filter((n) => !n.read).length;
      if (newCount > 0) {
        toast.warning(`${newCount} new notifications!`, {
          description: "Click the bell icon to view.",
        });
      }
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // CLOSE POPUPS ON OUTSIDE CLICK
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target))
        setShowPopup(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        "/notifications/mark-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setHasUnread(false);
      setShowPopup(false);

      toast.success("All notifications marked as read!");
    } catch {}
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <>
      {/* AI OVERLAY */}
      <AnimatePresence>
        {aiOpen && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 bg-black/60 backdrop-blur-sm z-40" /> )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.nav initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="fixed top-0 left-0 w-full h-20 z-30 px-4 sm:px-6 md:px-8 flex items-center justify-between border-b border-white/10 bg-[#0d0d0d]/80 backdrop-blur-xl" >
        {/* Background Glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-indigo-600/20 blur-3xl rounded-full" />
        </div>

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 relative z-20">
          {/* MOBILE MENU */}
          <button className="md:hidden p-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10" onClick={openSidebar} >
            <Menu className="text-[#80FFF9]" size={22} />
          </button>


          {/* GO HOME */}
          <button onClick={() => (window.location.href = "/")} className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10" >
            <ArrowLeft size={18} className="text-[#80FFF9]" />
            <span className="text-sm text-gray-200">Home</span>
          </button>

          {/* CHAT */}
          <button onClick={toggleChat} className="p-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10" >
            <MessageSquare className="text-[#80FFF9]" size={20} />
          </button>
        </div>

        {/* SEARCH */}
        <div className="hidden md:flex relative z-20">
          <div className="flex items-center bg-white/5 px-4 py-2 rounded-full border border-white/10 w-72 hover:bg-white/10">
            <Search size={18} className="text-gray-400" />
            <input type="text" placeholder="Search invoices, clients..." value={query} onChange={(e) => setQuery(e.target.value)} className="bg-transparent w-full outline-none ml-3 text-gray-200 text-sm" />
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
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
              )}
            </button>

            {/* DROPDOWN */}
            <AnimatePresence>
              {showPopup && (
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className=" absolute  mt-3  sm:right-0  right-1/2  sm:left-auto  left-1/2  -translate-x-1/2 sm:translate-x-0 w-[85vw] sm:w-80  max-w-[85vw] sm:max-w-none bg-[#151515]/95  border border-white/10  rounded-xl  shadow-xl  backdrop-blur-xl  overflow-hidden  z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                    <h3 className="text-sm font-medium text-white">
                      Notifications
                    </h3>

                    {notifications.some((n) => !n.read) && (
                      <button onClick={handleMarkAsRead} className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-[#80FFF9]" >
                        <Check size={14} /> Read
                      </button>
                    )}

                    <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-white" >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="max-h-56 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500 text-sm">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((note) => (
                        <div key={note._id} className={`p-4 border-b border-white/10 hover:bg-white/5 transition ${ !note.read && "bg-white/5" }`} >
                          <p className="text-sm text-[#80FFF9] font-medium">
                            {note.message}
                          </p>
                          {note.invoice && (
                            <>
                              <p className="text-xs text-gray-400">
                                Invoice: {note.invoice.invoice_number}
                              </p>
                              <p className="text-xs text-gray-400">
                                Client:{" "}
                                {note.invoice.client?.name || "Unknown"}
                              </p>
                              <p className="text-xs text-gray-400">
                                Amount: $
                                {Number(note.invoice.total).toFixed(2)}
                              </p>
                            </>
                          )}
                          <p className="mt-1 text-[10px] text-gray-500">
                            {new Date(note.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* USER MENU */}
          <div className="relative" ref={userMenuRef}>
            <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 sm:gap-3 bg-white/5 px-3 sm:px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition" >
              <User2 className="text-[#80FFF9]" size={20} />

              <span className={`text-[10px] sm:text-xs px-2 py-1 rounded-full border ${
                  currentPlan === "Pro"
                    ? "text-[#80FFF9] border-[#80FFF9]/40 bg-[#80FFF9]/10"
                    : currentPlan === "Enterprise"
                    ? "text-[#CB52D4] border-[#CB52D4]/40 bg-[#CB52D4]/10"
                    : "text-gray-300 border-white/10 bg-white/5"
                }`} >
                {currentPlan}
              </span>
            </button>

            <AnimatePresence>
            {userMenuOpen && (
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className=" absolute  mt-3  right-2 sm:right-0 w-[65vw] sm:w-64 max-w-[75vw] bg-[#151515]/95  border border-white/10  rounded-xl  shadow-xl  backdrop-blur-xl  p-5  z-50 " >

                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center">
                      <User2 size={26} className="text-[#80FFF9]" />
                    </div>

                    <div>
                      <p className="text-white font-medium text-sm">
                        {userData?.name || "Unnamed User"}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {userData?.email || "no-email"}
                      </p>
                    </div>
                  </div>

                  <button onClick={() => (window.location.href = "/dashboard/settings") } className="w-full flex items-center gap-2 px-2 py-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-md transition" >
                    <Settings size={16} /> Settings
                  </button>

                  <button onClick={handleLogout} className="w-full flex items-center gap-2 px-2 py-2 mt-1 text-red-400 hover:bg-red-600/20 rounded-md transition" >
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
