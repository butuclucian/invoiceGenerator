import React, { useEffect, useState } from "react";
import {
  CheckCircle,
  AlertTriangle,
  Sparkles,
  Clock,
  Zap,
  ArrowUpRight,
  Crown,
  CreditCard,
  Rocket,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import API from "../../utils/api"; // 🔹 importă instanța Axios configurată

const MySubscription = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch real subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          toast.error("Please log in to view your subscription.");
          setLoading(false);
          return;
        }

        const { data } = await API.get("/subscription/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setSubscription(data);
      } catch (err) {
        console.error("Subscription fetch error:", err);
        toast.error(
          err.response?.data?.message || "Failed to load subscription data."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const handleUpgrade = (target) => {
    toast.info(`Redirecting to ${target} upgrade...`);
    window.location.href = `/dashboard/upgrade?plan=${target}`;
  };

  const handleManageBilling = () => {
    toast.info("Opening Stripe Billing Portal...");
    window.location.href = "/dashboard/billing";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0e0e0e] text-white">
        <div className="flex flex-col items-center">
          <Clock className="animate-spin text-[#80FFF9]" size={28} />
          <p className="mt-4 text-gray-400">Loading your subscription...</p>
        </div>
      </div>
    );
  }

  const plan = subscription?.plan || "Free";
  const isActive = subscription?.status === "Active";

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
            My Subscription
          </h1>
          <p className="text-gray-400 text-sm">
            Manage your billing plan, renewal and AI feature access
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

      {/* ===== MAIN CARD ===== */}
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
            {subscription?.renewal_date && (
              <p className="text-gray-500 text-sm">
                Next renewal:{" "}
                {new Date(subscription.renewal_date).toLocaleDateString()}
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

        {/* FEATURES */}
        <div className="grid md:grid-cols-2 gap-4 mb-10 text-sm">
          {plan === "Free" && (
            <>
              <Feature text="Up to 3 invoices / month" />
              <Feature text="Basic client management" />
              <Feature text="Email delivery for invoices" />
              <Feature text="AI invoice generator unavailable" muted />
            </>
          )}
          {plan === "Pro" && (
            <>
              <Feature text="Unlimited invoices" />
              <Feature text="Smart analytics dashboard" />
              <Feature text="AI invoice generator unlocked" />
              <Feature text="Priority invoice email delivery" />
            </>
          )}
          {plan === "Enterprise" && (
            <>
              <Feature text="Team analytics & reports" />
              <Feature text="Priority AI processing" />
              <Feature text="Dedicated 24/7 support" />
              <Feature text="Custom integrations via API" />
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-4">
          {plan === "Free" && (
            <button
              onClick={() => handleUpgrade("Pro")}
              className="flex items-center gap-2 px-6 py-3 rounded-md bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition-all shadow-lg shadow-indigo-800/20"
            >
              <Zap size={18} />
              Upgrade to Pro
            </button>
          )}

          {plan === "Pro" && isActive && (
            <button
              onClick={handleManageBilling}
              className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <CreditCard size={16} />
              Manage Billing
            </button>
          )}

          {plan === "Enterprise" && isActive && (
            <button
              onClick={() => toast.success("You're at the top tier! 🎉")}
              className="flex items-center gap-2 px-6 py-3 border border-white/10 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition"
            >
              <ShieldCheck size={16} />
              Manage Account
            </button>
          )}
        </div>
      </div>

      {/* ===== UPGRADE / PROMO SUGGESTIONS ===== */}
      {plan === "Free" && (
        <UpgradeCard
          title="Upgrade to Pro"
          desc="Unlock AI invoice generation, advanced analytics, and unlimited invoices."
          gradient="from-indigo-600/20 to-purple-600/20"
          button="Go Pro"
          icon={Rocket}
          onClick={() => handleUpgrade("Pro")}
        />
      )}

      {plan === "Pro" && (
        <UpgradeCard
          title="Upgrade to Enterprise"
          desc="Empower your team with collaboration tools, faster AI processing, and 24/7 support."
          gradient="from-[#CB52D4]/20 to-[#80FFF9]/20"
          button="Go Enterprise"
          icon={ShieldCheck}
          onClick={() => handleUpgrade("Enterprise")}
        />
      )}

      {plan === "Enterprise" && (
        <UpgradeCard
          title="You're at the top!"
          desc="Thank you for being part of our elite users. You’re enjoying full access to every feature BillForgeAI offers."
          gradient="from-[#CB52D4]/20 to-[#80FFF9]/20"
          button="Exclusive Perks Coming Soon 🚀"
          icon={Sparkles}
          disabled
        />
      )}
    </div>
  );
};

/* 🔹 Reusable Feature */
const Feature = ({ text, muted }) => (
  <div
    className={`flex items-center gap-2 ${
      muted ? "opacity-50 text-gray-500" : "text-gray-200"
    }`}
  >
    <CheckCircle
      size={16}
      className={muted ? "text-gray-600" : "text-[#80FFF9]"}
    />
    {text}
  </div>
);

/* 🔹 Upgrade Suggestion Card */
const UpgradeCard = ({
  title,
  desc,
  gradient,
  button,
  icon: Icon,
  onClick,
  disabled,
}) => (
  <div
    className={`max-w-4xl mx-auto mt-12 bg-linear-to-r ${gradient} border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden`}
  >
    <div className="absolute inset-0 bg-linear-to-r from-[#80FFF9]/10 to-[#CB52D4]/10 blur-2xl -z-10" />
    <Icon className="mx-auto mb-4 text-[#80FFF9]" size={40} />
    <h3 className="text-2xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-400 max-w-md mx-auto mb-6">{desc}</p>
    <button
      onClick={!disabled ? onClick : null}
      disabled={disabled}
      className={`px-8 py-3 rounded-full text-white font-medium transition flex items-center justify-center gap-2 mx-auto ${
        disabled
          ? "bg-white/10 text-gray-400 cursor-not-allowed"
          : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90"
      }`}
    >
      <ArrowUpRight size={18} />
      {button}
    </button>
  </div>
);

export default MySubscription;
