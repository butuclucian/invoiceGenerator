import React, { useState } from "react";
import { Save, RotateCcw, X, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API from "../../utils/api";

const AddClients = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      const { data } = await API.post("/clients", formData);
      toast.success(`Client ${data.name} added successfully!`);
      navigate("/dashboard/clients");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        toast.error("Unauthorized! Please login again.");
      } else {
        toast.error("Failed to add client. Try again!");
      }
    }
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      address: "",
    });
    toast.info("Form reset successfully");
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-10 pt-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <UserPlus className="text-[#80FFF9]" size={26} />
            Clients
          </h1>
          <p className="text-gray-400 text-sm">
            Add clients to your business contacts
          </p>
          <p className="text-gray-500 text-xs mt-2">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto fade-in">
        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" placeholder="Client Name" value={formData.name} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input type="email" name="email" placeholder="client@email.com" value={formData.email} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
            <input type="text" name="phone" placeholder="07xx xxx xxx" value={formData.phone} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Company</label>
            <input type="text" name="company" placeholder="Client Company" value={formData.company} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Address</label>
          <input type="text" name="address" placeholder="Client address" value={formData.address} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"/>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 right-0 left-64 bg-[#111111]/90 border-t border-white/10 backdrop-blur-md py-4 z-40">
          <div className="flex justify-center gap-4 pr-8">
            
            <button type="button" onClick={handleReset} className="flex items-center gap-2 px-5 py-2 border border-white/20 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition">
              <RotateCcw size={16} />
              Reset
            </button>
            
            <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2 border border-white/20 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition">
              <X size={16} />
              Cancel
            </button>
            
            <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition" >
              <Save size={16} />
              Save Client
            </button>

          </div>
        </div>

      </form>

    </div>
  );
};

export default AddClients;
