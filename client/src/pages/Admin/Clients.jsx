import React, { useState } from "react";
import { UserPlus, Edit, Trash2, Mail, Phone, Building2, MapPin, Users } from "lucide-react";
import { toast } from "sonner";
import assets from "../../assets/assets";
import AddClientPopup from "../../components/Admin/AddClientPopup";
import EditClientPopup from "../../components/Admin/EditClientPopup";

const Clients = () => {
  const { dummyClients } = assets;
  const [clients, setClients] = useState(dummyClients);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const handleDelete = (name) => {
    toast.info(`Client ${name} deleted (dummy only)`);
  };

  const handleAddClient = (newClient) => {
    setClients((prev) => [newClient, ...prev]);
    toast.success("Client added successfully!");
  };

  const handleEditClient = (updatedClient) => {
    setClients((prev) =>
      prev.map((c) => (c._id === updatedClient._id ? updatedClient : c))
    );
    toast.success("Client updated successfully!");
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
        <p className="text-gray-400 text-sm">
          Manage your business contacts
        </p>
      </div>

        <button
          onClick={() => setShowAddPopup(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 rounded-md hover:opacity-90 transition"
        >
          <UserPlus size={18} />
          Add Client
        </button>
      </div>

      {/* Clients Grid */}
      {clients.length === 0 ? (
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
            <div
              key={client._id}
              className="bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-6 hover:border-[#80FFF9]/40 transition-all shadow-md shadow-indigo-500/5"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-white">{client.name}</h2>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedClient(client);
                      setShowEditPopup(true);
                    }}
                    className="p-2 text-gray-400 hover:text-indigo-400 transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(client.name)}
                    className="p-2 text-gray-400 hover:text-red-400 transition"
                    title="Delete"
                  >
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

      {/* Popup add client */}
      {showAddPopup && (
        <div className="animate-fadeIn fixed inset-0 flex items-center justify-center z-50">
          <AddClientPopup
            onClose={() => setShowAddPopup(false)}
            onCreate={handleAddClient}
          />
        </div>
      )}

      {/* Popup edit client */}
      {showEditPopup && selectedClient && (
        <div className="animate-fadeIn fixed inset-0 flex items-center justify-center z-50">
          <EditClientPopup
            client={selectedClient}
            onClose={() => setShowEditPopup(false)}
            onSave={handleEditClient}
          />
        </div>
      )}
    </div>
  );
};

export default Clients;
