import React, { useEffect, useState } from "react";
import { UserPlus, Edit, Trash2, Mail, Phone, Building2, MapPin, Users,} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch clients
  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/clients");
      setClients(data);
    } catch (err) {
      toast.error("Failed to load clients");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  //  Delete client
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;

    try {
      await API.delete(`/clients/${id}`);
      setClients((prev) => prev.filter((c) => c._id !== id));
      toast.success("Client deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete client");
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#0e0e0e] relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <Users className="text-[#80FFF9]" size={26} />
            Clients
          </h1>
          <p className="text-gray-400 text-sm">Manage your business contacts</p>
        </div>

        {/* 🧾 Add Client button */}
        <button onClick={() => navigate("/dashboard/clients/add")} className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition flex items-center gap-2">
          <UserPlus size={18} />
          Add Client
        </button>
      </div>

      {/* Clients Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-400">
          Loading clients...
        </div>
      ) : clients.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/20 rounded-xl bg-[#1a1a1a]/60">
          <UserPlus className="w-16 h-16 text-white/20 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-300">No clients found</h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adding a new client to get started.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div key={client._id} className="bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-6 hover:border-[#80FFF9]/40 transition-all shadow-md shadow-indigo-500/5">
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                
                <h2 className="text-lg font-semibold text-white">
                  {client.name}
                </h2>

                {/* buttons */}
                <div className="flex items-center gap-2">
                  {/*  Edit Button  */}
                  <button onClick={() => navigate(`/dashboard/clients/${client._id}/edit`)} className="p-2 text-gray-400 hover:text-indigo-400 transition" title="Edit">
                    <Edit size={18} />
                  </button>

                  {/* Delete Button */}
                  <button onClick={() => handleDelete(client._id)} className="p-2 text-gray-400 hover:text-red-400 transition" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Mail size={14} className="text-[#80FFF9]" />
                  <span>{client.email}</span>
                </div>
                {client.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-[#80FFF9]" />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.company && (
                  <div className="flex items-center gap-2">
                    <Building2 size={14} className="text-[#80FFF9]" />
                    <span>{client.company}</span>
                  </div>
                )}
                {client.address && (
                  <div className="flex items-center gap-2">
                    <MapPin size={14} className="text-[#80FFF9]" />
                    <span>{client.address}</span>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Clients;
