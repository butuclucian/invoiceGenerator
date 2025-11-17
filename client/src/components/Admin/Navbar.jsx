import React, { useEffect, useState, useRef } from "react";
import { Bell, X, Check, LogOut, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import API from "../../utils/api";

const Navbar = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const popupRef = useRef(null);

  //  Fetch Notifications
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
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Close outside popup
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mark read
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
      toast.success("All notifications marked as read");
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
    <nav className="sticky top-0 z-50 w-full h-20 backdrop-blur-xl bg-[#0d0d0d]/70  border-b border-white/10 shadow-lg shadow-black/30 flex items-center justify-between px-8 relative">
      {/* Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-[500px] h-40 bg-indigo-600/10 blur-3xl rounded-full"></div>
      </div>

      {/* LEFT — Home Button */}
      <div className="relative z-10 flex items-center gap-4">
        <button onClick={() => (window.location.href = "/")} className=" flex items-center gap-2 px-4 py-2 rounded-full  bg-white/5 backdrop-blur-md  border border-white/10 shadow-sm  text-gray-300 hover:text-white  hover:bg-[#80FFF9]/20 hover:border-[#80FFF9]/30  transition-all duration-200">
          <ArrowLeft size={18} className="text-[#80FFF9]" />
          <span className="text-sm font-medium">Home</span>
        </button>
      </div>

      {/* RIGHT — Notifications & Logout */}
      <div className="flex items-center gap-4 relative z-10">

        {/* Notifications */}
        <div className="relative" ref={popupRef}>
          <button onClick={() => setShowPopup(!showPopup)} className="relative bg-white/5 hover:bg-white/10 p-2 rounded-full border border-white/10 transition">
            <Bell size={20} className="text-[#80FFF9]" />
            {hasUnread && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            )}
          </button>

          {/* Popup */}
          {showPopup && (
            <div className="absolute right-0 mt-3 w-80 bg-[#151515]/95 border border-white/10 rounded-xl shadow-xl shadow-black/40 backdrop-blur-xl animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <h3 className="text-sm font-medium text-white">Notifications</h3>

                {notifications.some((n) => !n.read) && (
                  <button onClick={handleMarkAsRead} className="flex items-center gap-1 text-[12px] text-gray-400 hover:text-[#80FFF9]">
                    <Check size={14} /> Read
                  </button>
                )}

                <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-white">
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
                    <div key={note._id} className={`p-4 border-b border-white/10 hover:bg-white/5 transition 
                      ${
                        !note.read ? "bg-white/5" : ""
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
            </div>
          )}
        </div>

        {/* Logout */}
        <button onClick={handleLogout} className=" flex items-center gap-2 px-4 py-2 rounded-full  bg-white/5 backdrop-blur-md  border border-white/10 shadow-sm  text-gray-300 hover:text-white  hover:bg-red-600/20 hover:border-red-600  transition-all duration-200">
          <LogOut size={18} className="text-[#80FFF9]" />
          <span className="text-sm font-medium">Logout</span>
        </button>

      </div>
    </nav>
  );
};

export default Navbar;
