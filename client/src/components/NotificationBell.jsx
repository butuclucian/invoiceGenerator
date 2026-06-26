import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

  const fetchAiNotifications = async () => {
    try {
      const token = localStorage.getItem('token'); 
      
      const res = await axios.get(`${API_URL}/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const pendingInvoices = res.data
        .filter(inv => inv.status === 'pending')
        .reverse();

      setNotifications(pendingInvoices);
    } catch (error) {
      console.error("Eroare la încărcarea notificărilor AI:", error);
    }
  };

  useEffect(() => {
    fetchAiNotifications();
    const interval = setInterval(fetchAiNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = (invoiceId) => {
    setIsOpen(false);
    navigate(`/invoices/${invoiceId}`); 
  };

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2.5 text-gray-300 hover:text-white rounded-xl bg-white/5 border border-white/10 backdrop-blur-md transition-all duration-300 hover:bg-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>

        {notifications.length > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-2xl border border-white/10 bg-slate-950/90 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2 border-b border-white/5 flex justify-between items-center">
            <span className="font-semibold text-sm text-teal-400">Inbox Automatizare AI</span>
            <span className="text-xs bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full font-medium">
              {notifications.length} noi
            </span>
          </div>

          <div className="max-h-64 overflow-y-auto mt-1 space-y-1">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-center py-6 text-xs">Niciun email neprocesat momentan.</p>
            ) : (
              notifications.map((inv) => (
                <button key={inv._id}  onClick={() => handleNotificationClick(inv._id)}  className="w-full text-left p-3 rounded-xl hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between items-center w-full">
                    <span className="font-medium text-xs text-white">Factură: {inv.invoice_number}</span>
                    <span className="text-[10px] text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md font-mono">Review</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate">
                    Client detectat: <strong className="text-gray-200">{inv.client?.name || 'Necunoscut'}</strong>
                  </p>
                  <span className="text-[10px] text-gray-500 mt-1">Apasă pentru a deschide și edita proforma</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;