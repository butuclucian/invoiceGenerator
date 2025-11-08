import React, { useEffect, useState, useRef } from "react";
import { Bell, X, Check, LogOut } from "lucide-react";
import { UserButton, useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import API from "../../utils/api";

const Navbar = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const popupRef = useRef(null);
  const [today, setToday] = useState("");

  // 📅 Formatăm data curentă (ex: Saturday, November 8, 2025)
  useEffect(() => {
    const now = new Date();
    const formatted = now.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setToday(formatted);
  }, []);

  // ✅ Fetch notifications
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
        toast.warning(`${newCount} new invoice notification(s)!`, {
          description: "Click the bell icon to review them.",
          duration: 5000,
        });
      }
    } catch (err) {
      console.error("❌ Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // 🧩 Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Mark notifications as read
  const handleMarkAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await API.put(
        "/notifications/mark-read",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setHasUnread(false);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setShowPopup(false);
      toast.success("All notifications marked as read ✅");
    } catch {
      toast.error("Failed to mark notifications as read");
    }
  };

  // 🚪 Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="sticky top-0 flex items-center justify-between px-8 h-16 bg-[#0e0e0e]/95 border-b border-white/10 backdrop-blur-xl shadow-md shadow-indigo-500/10 z-40">
      {/* Left — Welcome message + date */}
      <div className="flex flex-col leading-tight">
        <h1 className="text-xl font-semibold text-white">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ""}! 👋
        </h1>
        <p className="text-sm text-gray-400">{today}</p>
      </div>

      {/* Right — Notifications + Profile + Logout */}
      <div className="flex items-center gap-4 relative">
        {/* 🔔 Notifications */}
        <div className="relative" ref={popupRef}>
          <button
            onClick={() => setShowPopup(!showPopup)}
            className="relative hover:bg-white/10 rounded-full p-2 transition-all"
          >
            <Bell size={20} color="#80FFF9" />
            {hasUnread && (
              <span className="absolute top-1 right-1 bg-red-500 w-2.5 h-2.5 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* 📬 Popup */}
          {showPopup && (
            <div className="absolute right-0 mt-3 w-80 bg-[#1a1a1a]/95 border border-white/10 rounded-xl shadow-lg shadow-black/40 overflow-hidden animate-in fade-in slide-in-from-top-2 z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-sm font-medium text-white">Notifications</h3>
                {notifications.some((n) => !n.read) && (
                  <button
                    onClick={handleMarkAsRead}
                    className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-[#80FFF9] transition"
                    title="Mark all as read"
                  >
                    <Check size={14} /> Read
                  </button>
                )}
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 hover:text-white transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="max-h-64 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">
                    No notifications yet.
                  </div>
                ) : (
                  notifications.map((note) => (
                    <div
                      key={note._id}
                      className={`p-4 border-b border-white/5 hover:bg-white/5 transition-all ${
                        !note.read ? "bg-white/5" : ""
                      }`}
                    >
                      <p className="text-sm font-medium text-[#80FFF9]">
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
                      <p className="text-[10px] text-gray-500 mt-1">
                        {new Date(note.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Logout — Elegant button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-linear-to-r from-[#1f2937] to-[#111827] border border-white/10 text-gray-300 hover:text-white hover:from-red-600 hover:to-red-500 hover:border-red-500 transition-all duration-200 shadow-sm"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
