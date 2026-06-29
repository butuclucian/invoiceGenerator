import React, { useEffect, useState } from "react";
import { Crown, Zap, ShieldCheck, RefreshCw, XCircle, CreditCard, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import API from "../../utils/api";

const MySubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/subscription/me");
      setSubscription(data);
    } catch (err) {
      toast.error("Nu am putut încărca datele abonamentului.");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (endpoint, payload = {}) => {
  setActionLoading(true);
  try {
    const { data } = await API.post(`/subscription/${endpoint}`, payload);
    
    if (data?.url) {
      window.location.href = data.url;
    } else {
      toast.success("Acțiune finalizată cu succes!");
      fetchSubscription();
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Eroare la procesare.");
  } finally {
    setActionLoading(false);
  }
};

  const plan = subscription?.plan || "Free";
  const isActive = subscription?.status === "Active";

  return (
    <div className="p-8 text-white min-h-screen bg-[#0e0e0e] relative pt-30 space-y-8">
      <div className="absolute top-20 right-10 w-72 h-72 bg-indigo-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <Crown className="text-[#80FFF9]" size={30} />
          My Subscription
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Gestionează planul tău, facturarea și accesul la funcțiile AI.
          </p>
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-[#121212]/60 border border-white/10 backdrop-blur-xl p-8 rounded-2xl mb-12 shadow-2xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h2 className="text-sm uppercase tracking-widest text-gray-500 font-bold mb-2">Plan Curent</h2>
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
                {plan}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${isActive ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                {isActive ? "Activ" : "Inactiv"}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => handleAction("create-billing-portal")}
              className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition text-sm"
            >
              <CreditCard size={16} /> Manage Billing
            </button>
            {isActive && (
              <button 
                onClick={() => handleAction("cancel")}
                className="flex items-center gap-2 px-5 py-2.5 bg-red-500/5 hover:bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl transition text-sm"
              >
                <XCircle size={16} /> Anulează
              </button>
            )}
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto">
        <h3 className="text-xl font-bold mb-6 text-center">Upgrade la un nivel superior</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            { name: "Pro", desc: "Pentru freelanceri", icon: Zap, color: "teal" },
            { name: "Enterprise", desc: "Pentru echipe mari", icon: ShieldCheck, color: "purple" }
          ].map((tier) => (
            <div key={tier.name} className="bg-[#151515] border border-white/10 p-6 rounded-2xl hover:border-white/20 transition">
              <tier.icon className={`text-${tier.color}-400 mb-4`} size={32} />
              <h4 className="text-lg font-bold">{tier.name}</h4>
              <p className="text-sm text-gray-400 mb-6">{tier.desc}</p>
              <button 
                onClick={() => handleAction("create-checkout-session", { plan: tier.name.toLowerCase() })}
                className={`w-full py-3 rounded-xl bg-gradient-to-r from-${tier.color}-600/20 to-indigo-600/20 border border-${tier.color}-500/30 hover:bg-${tier.color}-600/30 transition text-sm font-medium`}
              >
                Activează {tier.name}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MySubscription;