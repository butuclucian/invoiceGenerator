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
  FileText,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Billing = () => {
  const [subscription, setSubscription] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  // 🔹 Fetch subscription + invoices
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view billing.");
          return;
        }

        const [subRes, invRes] = await Promise.all([
          API.get("/subscription/me", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          API.get("/subscription/invoices", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setSubscription(subRes.data);
        setInvoices(invRes.data || []);
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
            Manage your payment methods and view your invoice history
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

      {/* ===== CURRENT PLAN ===== */}
      <section className="max-w-5xl mx-auto mb-14">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl font-bold">{plan} Plan</h2>
            <p
              className={`text-sm mt-2 ${
                isActive ? "text-green-400" : "text-gray-400"
              }`}
            >
              {isActive ? "Active subscription" : "Inactive"}
            </p>
            {renewal_date && (
              <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                <Calendar size={14} />
                Next renewal:{" "}
                {new Date(renewal_date).toLocaleDateString("en-US")}
              </p>
            )}
          </div>

          <div className="text-right">
            <p className="text-4xl font-bold text-[#80FFF9]">
              {plan === "Free" ? "$0" : plan === "Pro" ? "$9" : "$29"}
              <span className="text-lg text-gray-400 font-medium">/mo</span>
            </p>
            <p className="text-gray-500 text-xs mt-1">Billed monthly</p>

            <button
              onClick={handleOpenBillingPortal}
              disabled={portalLoading}
              className={`mt-5 flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition ${
                portalLoading ? "opacity-60 cursor-wait" : ""
              }`}
            >
              {portalLoading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> Opening...
                </>
              ) : (
                <>
                  <CreditCard size={16} /> Manage Billing
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* ===== PLAN BENEFITS ===== */}
      <section className="max-w-5xl mx-auto mb-20">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ShieldCheck className="text-[#CB52D4]" size={18} /> Plan Benefits
        </h2>

        {plan === "Pro" && (
          <ul className="text-gray-300 text-sm grid md:grid-cols-2 gap-y-2">
            <li>✅ Unlimited invoices</li>
            <li>✅ Smart analytics dashboard</li>
            <li>✅ AI invoice generation</li>
            <li>✅ Priority email delivery</li>
          </ul>
        )}
        {plan === "Enterprise" && (
          <ul className="text-gray-300 text-sm grid md:grid-cols-2 gap-y-2">
            <li>🚀 Dedicated AI processing</li>
            <li>👥 Team collaboration & analytics</li>
            <li>🔒 Premium support 24/7</li>
            <li>⚙️ Custom integrations & API</li>
          </ul>
        )}
        {plan === "Free" && (
          <ul className="text-gray-400 text-sm grid md:grid-cols-2 gap-y-2">
            <li>⚙️ Limited invoices (max 3/month)</li>
            <li>🔒 Upgrade to unlock AI features</li>
          </ul>
        )}
      </section>

      {/* ===== PAYMENT HISTORY ===== */}
      <section className="max-w-5xl mx-auto">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <FileText className="text-[#80FFF9]" size={18} /> Payment History
        </h2>

        {invoices.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No invoices found. Your payment history will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-separate border-spacing-y-2">
              <thead>
                <tr className="text-gray-400 text-left">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Amount</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr
                    key={i}
                    className="bg-[#1a1a1a]/70 hover:bg-[#202020] transition"
                  >
                    <td className="py-3 px-3 text-gray-300">
                      {new Date(inv.created * 1000).toLocaleDateString("en-US")}
                    </td>
                    <td className="py-3 px-3 text-[#80FFF9] font-medium">
                      ${(inv.amount_paid / 100).toFixed(2)}
                    </td>
                    <td className="py-3 px-3">
                      {inv.paid ? (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle size={14} /> Paid
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400">
                          <XCircle size={14} /> Failed
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      <a
                        href={inv.hosted_invoice_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#80FFF9] hover:underline"
                      >
                        View Invoice
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Billing;
