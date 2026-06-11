import React, { useState, useEffect } from "react";
import { Trash2, History, Calendar, User, Loader2, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // 🔥 Adăugat pentru navigare
import API from "../../utils/api";
import { toast } from "sonner";

const AiHistoryLog = () => {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // 🔥 Inițializare hook de navigare

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/ai/history");
      if (data.success) {
        setHistoryItems(data.history);
      }
    } catch (error) {
      console.error("Eroare la încărcarea istoricului AI:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const { data } = await API.delete(`/ai/history/${id}`);
      if (data.success) {
        toast.success("Factura a fost ștearsă din istoric.");
        setHistoryItems((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error("Nu s-a putut șterge documentul.");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="mt-12 bg-[#121212]/40 border border-white/5 backdrop-blur-xl rounded-2xl p-6 relative z-10">
      <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
        <div className="flex items-center gap-2">
          <History className="text-indigo-400" size={20} />
          <h2 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
            AI Generation History Log
          </h2>
        </div>
        <span className="text-xs font-mono text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
          {historyItems.length} documente temporare
        </span>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8 text-gray-500 gap-2">
          <Loader2 className="animate-spin text-indigo-400" size={18} />
          <span className="text-xs font-mono uppercase tracking-wider">Se încarcă jurnalul stocării...</span>
        </div>
      ) : historyItems.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-6">
          Nu există facturi preliminare în istoric. Toate documentele au fost emise sau șterse.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {historyItems.map((item) => (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="bg-[#161616]/80 border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      {item.invoice_number}
                    </span>
                    <span className="text-[10px] text-gray-500 flex items-center gap-1 font-mono">
                      <Calendar size={10} />
                      {new Date(item.createdAt).toLocaleDateString("ro-RO")}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-white flex items-center gap-1.5 mt-1">
                    <User size={14} className="text-gray-500" />
                    {item.client?.name || "Client Necunoscut"}
                  </h3>
                  
                  <p className="text-[11px] text-gray-500 mt-1 truncate">
                    {item.notes || "Generat prin analiză de text automatizată."}
                  </p>

                  <div className="mt-3 text-xs text-gray-400">
                    <span className="text-[10px] font-mono text-gray-500 block mb-1 uppercase tracking-wider">Servicii extrase:</span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      {item.items && item.items.length > 0 ? (
                        item.items.map((srv, idx) => (
                          <li key={idx} className="text-gray-300">
                            {srv.description} <span className="text-gray-500">({srv.quantity} x {srv.unit_price} {item.currency || "RON"})</span>
                          </li>
                        ))
                      ) : (
                        <span className="text-red-400/80 italic">Niciun serviciu mapat</span>
                      )}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/5">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase block font-mono">Valoare calculată</span>
                    <span className="text-base font-black text-[#80FFF9]">
                      {item.total} {item.currency || "RON"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* 🔥 MODIFICARE: Butonul tău perfect de Editare cu navigare dinamică */}
                    <button
                      onClick={() => navigate(`/dashboard/invoices/${item._id}/edit`)}
                      className="p-2 text-gray-400 hover:text-indigo-400 transition"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition"
                      title="Șterge din istoric"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default AiHistoryLog;