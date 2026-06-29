import React, { useEffect, useState } from "react";
import { UserPlus, Edit, Trash2, Mail, Phone, Building2, MapPin, Users, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../utils/api";
import { useSearchStore } from "../../store/useSearchStore";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { query } = useSearchStore();

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/clients");
      setClients(data);
      setFilteredClients(data);
    } catch (err) {
      toast.error("Eroare la încărcarea clienților");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchClients(); }, []);

  useEffect(() => {
    const q = query.toLowerCase();
    const results = clients.filter((c) => 
      c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || 
      c.company?.toLowerCase().includes(q)
    );
    setFilteredClients(results);
  }, [query, clients]);

  const handleDelete = async (id) => {
    if (!window.confirm("Sigur ștergi acest client?")) return;
    try {
      await API.delete(`/clients/${id}`);
      setClients((prev) => prev.filter((c) => c._id !== id));
      toast.success("Client șters!");
    } catch (err) { toast.error("Eroare la ștergere"); }
  };

  return (
    <div className="p-8 pt-30 min-h-screen bg-[#0e0e0e] text-white">
      <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-500/5 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="text-[#80FFF9]" /> Clienți
          </h1>
          <p className="text-gray-400 mt-1">Gestionare portofoliu clienți</p>
        </div>

        <button 
          onClick={() => navigate("/dashboard/clients/add")} 
          className="px-6 py-3 rounded-2xl bg-[#80FFF9]/10 border border-[#80FFF9]/20 hover:bg-[#80FFF9]/20 transition flex items-center gap-2 font-medium"
        >
          <UserPlus size={18} /> Adaugă Client
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Se încarcă...</div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredClients.map((client) => (
            <motion.div 
              layout
              key={client._id} 
              className="group bg-[#151515]/60 border border-white/5 backdrop-blur-xl p-6 rounded-3xl hover:border-white/10 transition-all hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-bold">{client.name}</h2>
                  <p className="text-xs text-gray-500 font-mono mt-0.5">{client.brand}</p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => navigate(`/dashboard/clients/${client._id}/edit`)} className="p-2 bg-white/5 rounded-lg hover:bg-white/10"><Edit size={14}/></button>
                  <button onClick={() => handleDelete(client._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"><Trash2 size={14}/></button>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Mail, val: client.email },
                  { icon: Phone, val: client.phone },
                  { icon: MapPin, val: client.address }
                ].filter(item => item.val).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm text-gray-400">
                    <div className="p-1.5 bg-white/5 rounded-md text-[#80FFF9]"><item.icon size={14} /></div>
                    {item.val}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Clients;