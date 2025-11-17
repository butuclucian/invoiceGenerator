import React, { useEffect, useState, useRef } from "react";
import {
  Bell,
  X,
  Check,
  LogOut,
  ArrowLeft,
  Settings,
  Search,
  User2,
  Crown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import API from "../../utils/api";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [subscription, setSubscription] = useState(null);

  const popupRef = useRef(null);
  const userMenuRef = useRef(null);

  // ===============================
  // FETCH USER DATA
  // ===============================
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserData(data);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    fetchUser();
  }, []);

  // ===============================
  // FETCH SUBSCRIPTION
  // ===============================
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get("/subscription/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubscription(data);
      } catch (err) {
        console.error("Subscription fetch error:", err);
      }
    };

    fetchSubscription();
  }, []);

  const currentPlan = subscription?.plan || "Free";

  // ===============================
  // FETCH NOTIFICATIONS
  // ===============================
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
    } catch (err) {
      console.error("Notif fetch error:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target))
        setShowPopup(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark notifications read
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
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 z-50 w-full h-20  backdrop-blur-2xl bg-[#0d0d0d]/70  border-b border-white/10 shadow-xl shadow-black/30  flex items-center justify-between px-8 relative">

      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-indigo-600/20 blur-3xl rounded-full"></div>
      </div>

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4 relative z-10">
        <button
          onClick={() => (window.location.href = "/")}
          className="flex items-center gap-2 px-4 py-2 rounded-full 
            bg-white/5 backdrop-blur-md border border-white/10 shadow-sm 
            text-gray-300 hover:text-white 
            hover:bg-[#80FFF9]/20 hover:border-[#80FFF9]/30 
            transition-all duration-200"
        >
          <ArrowLeft size={18} className="text-[#80FFF9]" />
          <span className="text-sm font-medium">Home</span>
        </button>
      </div>

      {/* CENTER SEARCH */}
      <div className="hidden md:flex relative z-10">
        <div className="flex items-center bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md w-72 hover:bg-white/10 transition">
          <Search size={18} className="text-gray-400" />
          <input
            type="text"
            placeholder="Search invoices, clients..."
            className="bg-transparent w-full outline-none ml-3 text-gray-200 text-sm"
          />
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6 relative z-10">

        {/* ================= NOTIFICATIONS ================= */}
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

          <AnimatePresence>
            {showPopup && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-80 bg-[#151515]/95 
                  border border-white/10 rounded-xl shadow-xl 
                  backdrop-blur-xl overflow-hidden z-50"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                  <h3 className="text-sm font-medium text-white">Notifications</h3>

                  {notifications.some((n) => !n.read) && (
                    <button
                      onClick={handleMarkAsRead}
                      className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-[#80FFF9]"
                    >
                      <Check size={14} /> Read
                    </button>
                  )}

                  <button
                    onClick={() => setShowPopup(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.map((note) => (
                      <div
                        key={note._id}
                        className={`p-4 border-b border-white/10 hover:bg-white/5 transition ${
                          !note.read && "bg-white/5"
                        }`}
                      >
                        <p className="text-sm text-[#80FFF9] font-medium">
                          {note.message}
                        </p>
                        {note.invoice && (
                          <>
                            <p className="text-xs text-gray-400">
                              Invoice: {note.invoice.invoice_number}
                            </p>
                            <p className="text-xs text-gray-400">
                              Client: {note.invoice.client?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-400">
                              Amount: ${Number(note.invoice.total).toFixed(2)}
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

        {/* ================= USER MENU ================= */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition"
          >
            <User2 className="text-[#80FFF9]" size={22} />

            <span className={`text-xs px-2 py-1 rounded-full 
              border 
              ${
                currentPlan === "Pro"
                  ? "text-[#80FFF9] border-[#80FFF9]/40 bg-[#80FFF9]/10"
                  : currentPlan === "Enterprise"
                  ? "text-[#CB52D4] border-[#CB52D4]/40 bg-[#CB52D4]/10"
                  : "text-gray-300 border-white/10 bg-white/5"
              }
            `}>
              {currentPlan}
            </span>
          </button>

          <AnimatePresence>
            {userMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 mt-3 w-64 bg-[#151515]/95 border border-white/10 rounded-xl shadow-xl backdrop-blur-xl p-5 z-50"
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/10 w-12 h-12 rounded-full flex items-center justify-center">
                    <User2 size={26} className="text-[#80FFF9]" />
                  </div>

                  <div className="flex flex-col">
                    <p className="text-white font-medium text-sm">
                      {userData?.name || "Unnamed User"}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {userData?.email || "no-email@unknown.com"}
                    </p>
                  </div>
                </div>


                <div className="border-b border-white/10 mb-3"></div>

                <button
                  onClick={() => (window.location.href = "/dashboard/settings")}
                  className="w-full flex items-center gap-2 px-2 py-2 
                    text-gray-300 hover:bg-white/5 hover:text-white 
                    rounded-md transition"
                >
                  <Settings size={16} /> Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-2 py-2 
                    text-red-400 hover:bg-red-600/20 
                    rounded-md transition mt-1"
                >
                  <LogOut size={16} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
