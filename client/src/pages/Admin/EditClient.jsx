import React, { useEffect, useState } from "react";
import { Save, RotateCcw, X, UserCog } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import API from "../../utils/api";

const EditClient = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // 🔥 Extins cu toate câmpurile noi din structura ta premium
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    cui: "",
    reg_com: "",
    client_code: "",
    is_tva_payer: false,
    address: "",
    city: "",
    county: "",
    country: "Romania",
    iban: "",
    bank: "",
    contact_person: "",
    email: "",
    phone: ""
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const { data } = await API.get(`/clients/${id}`);
        // Mapăm cu fallback ("") pentru a preveni erorile de tip "uncontrolled input"
        setFormData({
          name: data.name || "",
          brand: data.brand || "",
          cui: data.cui || "",
          reg_com: data.reg_com || "",
          client_code: data.client_code || "",
          is_tva_payer: data.is_tva_payer ?? false,
          address: data.address || "",
          city: data.city || "",
          county: data.county || "",
          country: data.country || "Romania",
          iban: data.iban || "",
          bank: data.bank || "",
          contact_person: data.contact_person || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch (error) {
        toast.error("Failed to load client data");
        navigate("/dashboard/clients");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // Gestionăm diferențiat input-urile de tip checkbox/radio pentru plătitorul de TVA
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Please fill in all required fields (Name & Email)!");
      return;
    }

    try {
      await API.put(`/clients/${id}`, formData);
      toast.success("Client updated successfully!");
      navigate("/dashboard/clients");
    } catch (error) {
      toast.error("Failed to update client.");
    }
  };

  const handleReset = () => {
    toast.info("Changes discarded");
    navigate("/dashboard/clients");
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-mono text-xs uppercase tracking-wider">
        Loading client data...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-10 pt-8 pb-32">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            <UserCog className="text-[#80FFF9]" size={26} />
            Edit Client
          </h1>
          <p className="text-gray-400 text-sm">
            Modify existing client configuration and fiscal information
          </p>
          <p className="text-gray-500 text-xs mt-2 font-mono">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto relative z-10">
        
        {/* SECTION 1: GENERAL & FISCAL INFO */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h3 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-2">
            General & Fiscal Info
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                Denumire / Full Name <span className="text-red-500">*</span>
              </label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" required />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Brand</label>
              <input type="text" name="brand" placeholder="Nume comercial" value={formData.brand} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">CIF / CNP</label>
              <input type="text" name="cui" placeholder="ROxxxxxxxx" value={formData.cui} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Reg Com</label>
              <input type="text" name="reg_com" placeholder="Jxx/xxxx/xxxx" value={formData.reg_com} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Cod Client</label>
              <input type="text" name="client_code" placeholder="CLNT-00x" value={formData.client_code} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Plătitor TVA</label>
            <div className="flex items-center gap-6 mt-1">
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="radio" name="is_tva_payer" value="true" checked={formData.is_tva_payer === true || formData.is_tva_payer === "true"} onChange={() => setFormData({ ...formData, is_tva_payer: true })} className="accent-[#80FFF9] bg-[#161616] border-white/10" />
                Da
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                <input type="radio" name="is_tva_payer" value="false" checked={formData.is_tva_payer === false || formData.is_tva_payer === "false"} onChange={() => setFormData({ ...formData, is_tva_payer: false })} className="accent-[#80FFF9] bg-[#161616] border-white/10" />
                Nu
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 2: ADDRESS & LOCATION */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h3 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-2">
            Address & Location
          </h3>
          
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Adresă completă</label>
            <input type="text" name="address" placeholder="Strada, Număr, Bloc..." value={formData.address} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Localitate</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Județ</label>
              <input type="text" name="county" value={formData.county} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Țară</label>
              <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>
        </div>

        {/* SECTION 3: BANK DETAILS */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h3 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-2">
            Bank Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Cont IBAN</label>
              <input type="text" name="iban" placeholder="ROxx xxxx xxxx xxxx xxxx xxxx" value={formData.iban} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none font-mono uppercase transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Bancă</label>
              <input type="text" name="bank" placeholder="Numele băncii" value={formData.bank} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>
        </div>

        {/* SECTION 4: CONTACT PERSONS */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h3 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-2">
            Contact Persons
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Persoană de Contact</label>
              <input type="text" name="contact_person" placeholder="Nume reprezentant" value={formData.contact_person} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input type="email" name="email" placeholder="client@email.com" value={formData.email} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" required />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Telefon</label>
              <input type="text" name="phone" placeholder="07xx xxx xxx" value={formData.phone} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>
        </div>

        {/* FIXED ACTION BAR */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-[#111111]/90 border-t border-white/10 backdrop-blur-md py-4 z-40">
          <div className="flex justify-center gap-3 sm:gap-4 px-4">
            <button type="button" onClick={handleReset} className="flex items-center gap-2 px-4 sm:px-5 py-2 border border-white/20 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/10 transition duration-300">
              <RotateCcw size={14} />
              Reset
            </button>

            <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 sm:px-5 py-2 border border-white/20 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/10 transition duration-300">
              <X size={14} />
              Cancel
            </button>

            <button type="submit" className="flex items-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-600/20 hover:from-teal-500/30 hover:to-indigo-600/30 border border-teal-500/30 hover:border-teal-400/60 text-xs font-mono uppercase tracking-wider text-[#80FFF9] font-bold shadow-lg transition duration-300">
              <Save size={14} />
              Save Changes
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditClient;