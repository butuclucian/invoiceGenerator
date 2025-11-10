import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import API from "../../utils/api";
import {
  CreditCard,
  Calendar,
  ShieldCheck,
  Sparkles,
  Loader2,
  Wallet,
  Crown,
} from "lucide-react";

const Billing = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  // 🔹 Fetch current subscription info
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view billing.");
          return;
        }

        const { data } = await API.get("/subscription/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSubscription(data);
      } catch (err) {
        console.error("Billing fetch error:", err);
        toast.error("Failed to load billing info.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔹 Open Stripe Billing Portal
  const handleOpenBillingPortal = async () => {
    try {
      setPortalLoading(true);
      const token = localStorage.getItem("token");
      const { data } = await API.post(
        "/subscription/create-billing-portal",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to open billing portal.");
      }
    } catch (err) {
      console.error("Billing portal error:", err);
      toast.error("Unable to open Stripe billing portal.");
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-gray-300">
        <Loader2 size={28} className="animate-spin text-[#80FFF9]" />
        <p className="ml-3">Loading billing information...</p>
      </div>
    );
  }

  if (!subscription)
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex flex-col items-center justify-center text-gray-400">
        <ShieldCheck size={40} className="text-[#80FFF9] mb-4" />
        <p>No active subscription found.</p>
      </div>
    );

  const { plan, status, renewal_date } = subscription;
  const isActive = status === "Active";

  const planColors = {
    Free: "from-gray-800/60 to-gray-900/80 border-white/10",
    Pro: "from-indigo-600/25 to-purple-600/25 border-[#80FFF9]/30",
    Enterprise: "from-[#CB52D4]/25 to-[#80FFF9]/25 border-[#CB52D4]/30",
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-8 py-12">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <Crown className="text-[#80FFF9]" size={26} />
            Billing & Payments
          </h1>
          <p className="text-gray-400 text-sm">
            View and manage your current plan, payments, and invoices
          </p>
        </div>

        {isActive && (
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm border ${
              plan === "Pro"
                ? "text-[#80FFF9] border-[#80FFF9]/30 bg-[#80FFF9]/10"
                : plan === "Enterprise"
                ? "text-[#CB52D4] border-[#CB52D4]/30 bg-[#CB52D4]/10"
                : "text-gray-400 border-white/10 bg-white/5"
            }`}
          >
            <Sparkles size={16} />
            You’re {plan === "Enterprise" ? "Enterprise" : plan}!
          </div>
        )}
      </div>

      {/* ===== BILLING CARD ===== */}
      <div
        className={`max-w-4xl mx-auto bg-gradient-to-br ${planColors[plan]} border rounded-2xl p-10 shadow-lg shadow-indigo-900/10 relative overflow-hidden transition-all`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#80FFF9]/5 to-[#CB52D4]/10 blur-3xl -z-10" />

        {/* HEADER INFO */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-wide">{plan} Plan</h2>
            <p className="text-gray-400 text-sm mt-1">
              {isActive ? "Currently Active" : "Inactive"}
            </p>
            {renewal_date && (
              <p className="text-gray-500 text-sm flex items-center gap-1 mt-1">
                <Calendar size={14} />
                Next renewal:{" "}
                {new Date(renewal_date).toLocaleDateString("en-US")}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-5xl font-bold text-[#80FFF9]">
              {plan === "Free"
                ? "$0"
                : plan === "Pro"
                ? "$9"
                : "$29"}
              <span className="text-lg text-gray-400 font-medium">/mo</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">Billed monthly</p>
          </div>
        </div>

        {/* BILLING MANAGEMENT */}
        <div className="border border-white/10 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <CreditCard className="text-[#80FFF9]" size={18} /> Manage Billing
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Access your Stripe billing portal to update payment methods, view
            invoices, or cancel your subscription.
          </p>

          <button
            onClick={handleOpenBillingPortal}
            disabled={portalLoading}
            className={`flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition ${
              portalLoading ? "opacity-60 cursor-wait" : ""
            }`}
          >
            {portalLoading ? (
              <>
                <Loader2 className="animate-spin" size={16} /> Opening...
              </>
            ) : (
              <>
                <CreditCard size={16} /> Open Billing Portal
              </>
            )}
          </button>
        </div>

        {/* PLAN BENEFITS */}
        <div className="border border-white/10 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <ShieldCheck className="text-[#CB52D4]" size={18} /> Plan Benefits
          </h2>
          {plan === "Pro" && (
            <ul className="text-gray-300 text-sm space-y-2">
              <li>✅ Unlimited invoices</li>
              <li>✅ Smart analytics dashboard</li>
              <li>✅ AI invoice generation</li>
              <li>✅ Priority email delivery</li>
            </ul>
          )}
          {plan === "Enterprise" && (
            <ul className="text-gray-300 text-sm space-y-2">
              <li>🚀 Dedicated AI processing</li>
              <li>👥 Team collaboration & analytics</li>
              <li>🔒 Premium support 24/7</li>
              <li>⚙️ Custom integrations & API</li>
            </ul>
          )}
          {plan === "Free" && (
            <ul className="text-gray-400 text-sm space-y-2">
              <li>⚙️ Limited invoices (max 3/month)</li>
              <li>🔒 Upgrade to unlock AI features</li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Billing;
