import React, { useEffect, useState } from "react";
import { Save, RotateCcw, X, UserCog } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import API from "../../utils/api";

const EditClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);

  // Fetch existing client data
  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { data } = await API.get(`/clients/${id}`);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          company: data.company || "",
          address: data.address || "",
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load client data");
        navigate("/dashboard/clients");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  //  Update client
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields!");
      return;
    }

    try {
      await API.put(`/clients/${id}`, formData);
      toast.success("Client updated successfully!");
      navigate("/dashboard/clients");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update client. Try again!");
    }
  };

  const handleReset = () => {
    toast.info("Changes discarded");
    navigate("/dashboard/clients");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading client data...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-10 pt-8 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <UserCog className="text-[#80FFF9]" size={26} />
            Edit Client
          </h1>
          <p className="text-gray-400 text-sm">
            Modify existing client information
          </p>
          <p className="text-gray-500 text-xs mt-2">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto fade-in">

        {/* full name and email address */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* full name */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input type="text" name="name" placeholder="Client Name" value={formData.name} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"/>
          </div>

          {/* email address */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input type="email" name="email" placeholder="client@email.com" value={formData.email} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"/>
          </div>

        </div>

        {/* phone number and company */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* phone number */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Phone Number</label>
            <input type="text" name="phone" placeholder="07xx xxx xxx" value={formData.phone} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"/>
          </div>

          {/* company */}
          <div>
            <label className="block text-sm text-gray-300 mb-2">Company</label>
            <input type="text" name="company" placeholder="Client Company" value={formData.company} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"/>
          </div>

        </div>

        {/* address */}
        <div>
          <label className="block text-sm text-gray-300 mb-2">Address</label>
          <input type="text" name="address" placeholder="Client address" value={formData.address} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"/>
        </div>

        {/* footer */}
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
            <button type="submit" className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditClient;
