import React, { useEffect, useState, useRef } from "react";
import { Bell, X, Check } from "lucide-react";
import { UserButton } from "@clerk/clerk-react";
import { toast } from "sonner";
import API from "../../utils/api";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const popupRef = useRef(null);

  // ✅ Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // Generează notificări noi (facturi near due)
      await API.get("/notifications/generate", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Apoi le preia pe toate
      const { data } = await API.get("/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(data);
      setHasUnread(data.some((n) => !n.read));

      const newCount = data.filter((n) => !n.read).length;
      if (newCount > 0) {
        toast.warning(`⚠️ ${newCount} new invoice notification(s)!`, {
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

    // Auto-refresh la fiecare oră
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

  // ✅ Mark notifications as read (DB + UI)
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

  return (
    <nav className="sticky top-0 flex items-center justify-between px-6 md:px-10 h-16 bg-[#111111]/90 border-b border-white/10 backdrop-blur-xl shadow-lg shadow-indigo-500/5 z-40">
      {/* Logo / Title */}
      <h1 className="text-xl font-semibold text-[#80FFF9]">
        Invoice Generator
      </h1>

      {/* Right Side */}
      <div className="flex items-center gap-5 relative">
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
                <h3 className="text-sm font-medium text-white">
                  Notifications
                </h3>
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
                    🎉 No notifications yet.
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

                      {/* Factura atașată */}
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

        {/* Clerk Profile */}
        <UserButton
          appearance={{
            elements: { avatarBox: "w-8 h-8" },
          }}
          afterSignOutUrl="/"
        />

        {/* Logout */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
