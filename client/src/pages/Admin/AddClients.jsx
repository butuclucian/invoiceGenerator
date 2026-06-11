import React, { useState } from "react";
import { Save, RotateCcw, X, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API from "../../utils/api";

const AddClients = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    cui: "",
    reg_com: "",
    client_code: "",
    is_tva_payer: false, // 🔥 REPARAT: Aliniat cu modelul Mongoose (din is_vat_payer în is_tva_payer)
    address: "",
    city: "",
    county: "",
    country: "Romania",
    iban: "",
    bank: "",
    contact_person: "",
    email: "",
    phone: "",
    company: "", // Păstrat în stare pentru consistență structurală
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleVatChange = (isPayer) => {
    // 🔥 REPARAT: Actualizează cheia corectă din baza de date
    setFormData({ ...formData, is_tva_payer: isPayer });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name) {
      toast.error("Please fill in the required Denumire field!");
      return;
    }

    try {
      // Trimitem formData complet direct către backend
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
      phone: "",
      company: "",
    });
    toast.info("Form reset successfully");
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-10 pt-8 overflow-hidden pb-32">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            <UserPlus className="text-[#80FFF9]" size={26} />
            Add New Client
          </h1>
          <p className="text-gray-400 text-sm">
            Add clients to your business contacts with full fiscal details
          </p>
          <p className="text-gray-500 text-xs mt-2 font-mono">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl mx-auto relative z-10">

        {/* --- SECTIUNEA 1: Identificare & Date Principale --- */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase border-b border-white/5 pb-2">
            General & Fiscal Info
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">
                Denumire <span className="text-red-500">*</span>
              </label>
              <input type="text" name="name" placeholder="Numele firmei sau al clientului" value={formData.name} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" required />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Brand</label>
              <input type="text" name="brand" placeholder="Nume comercial / Brand" value={formData.brand} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">CIF / CNP</label>
              <input type="text" name="cui" placeholder="RO12345678 sau CNP" value={formData.cui} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Reg com</label>
              <input type="text" name="reg_com" placeholder="J35/XXXX/YYYY" value={formData.reg_com} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Cod client</label>
              <input type="text" name="client_code" placeholder="Ex: CL-001" value={formData.client_code} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Platitor TVA</label>
            <div className="flex gap-4 mt-1">
              <button type="button" onClick={() => handleVatChange(true)} className={`px-4 py-1.5 rounded-lg border text-xs font-mono uppercase tracking-wider transition duration-300 ${formData.is_tva_payer ? "bg-[#80FFF9]/10 border-[#80FFF9] text-[#80FFF9]" : "bg-[#161616] border-white/10 text-gray-400 hover:border-white/20"}`}>
                Da
              </button>
              <button type="button" onClick={() => handleVatChange(false)} className={`px-4 py-1.5 rounded-lg border text-xs font-mono uppercase tracking-wider transition duration-300 ${!formData.is_tva_payer ? "bg-red-500/10 border-red-500/30 text-red-400" : "bg-[#161616] border-white/10 text-gray-400 hover:border-white/20"}`}>
                Nu
              </button>
            </div>
          </div>
        </div>

        {/* --- SECTIUNEA 2: Adresa & Localizare --- */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase border-b border-white/5 pb-2">
            Address & Location
          </h2>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Adresa</label>
            <input type="text" name="address" placeholder="Strada, Numar, Bloc, Apartament" value={formData.address} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Localitate</label>
              <input type="text" name="city" placeholder="Localitate" value={formData.city} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Judet</label>
              <input type="text" name="county" placeholder="Judet / Sector" value={formData.county} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Tara</label>
              <input type="text" name="country" placeholder="Tara" value={formData.country} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>
        </div>

        {/* --- SECTIUNEA 3: Detalii Financiare / Bancare --- */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase border-b border-white/5 pb-2">
            Bank Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">IBAN</label>
              <input type="text" name="iban" placeholder="ROXX BTRL XXXX XXXX XXXX XXXX" value={formData.iban} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none font-mono uppercase transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Banca</label>
              <input type="text" name="bank" placeholder="Numele Bancii" value={formData.bank} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>
        </div>

        {/* --- SECTIUNEA 4: Contact --- */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h2 className="text-sm font-mono font-bold tracking-wider text-indigo-400 uppercase border-b border-white/5 pb-2">
            Contact Persons
          </h2> 

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Persoana contact</label>
              <input type="text" name="contact_person" placeholder="Nume persoana" value={formData.contact_person} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Email</label>
              <input type="email" name="email" placeholder="client@email.com" value={formData.email} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-gray-400 mb-2">Telefon</label>
              <input type="text" name="phone" placeholder="07xx xxx xxx" value={formData.phone} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>

          <div className="hidden">
            <input type="text" name="company" value={formData.company} onChange={handleChange} />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-[#111111]/90 border-t border-white/10 backdrop-blur-md py-4 z-40">
          <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 px-4">
            
            <button type="button" onClick={handleReset} className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 border border-white/20 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/10 transition duration-300">
              <RotateCcw size={14} />
              Reset
            </button>

            <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 border border-white/20 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/10 transition duration-300">
              <X size={14} />
              Cancel
            </button>

            <button type="submit" className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-600/20 hover:from-teal-500/30 hover:to-indigo-600/30 border border-teal-500/30 hover:border-teal-400/60 text-xs font-mono uppercase tracking-wider text-[#80FFF9] font-bold shadow-lg transition duration-300">
              <Save size={14} />
              Save Client
            </button>

          </div>
        </div>

      </form>
    </div>
  );
};

export default AddClients;