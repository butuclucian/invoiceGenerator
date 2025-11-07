import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";

const EditClientPopup = ({ client, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: client.name || "",
    email: client.email || "",
    phone: client.phone || "",
    company: client.company || "",
    address: client.address || "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Name and email are required!");
      return;
    }

    const updatedClient = { ...client, ...formData };
    onSave(updatedClient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111111]/95 border border-white/10 rounded-2xl shadow-xl shadow-indigo-500/10 w-full max-w-lg p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Edit <span className="text-[#80FFF9]">Client</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-[#0e0e0e]/80 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-[#0e0e0e]/80 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-[#0e0e0e]/80 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Company</label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full bg-[#0e0e0e]/80 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-[#0e0e0e]/80 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-white/20 text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientPopup;
