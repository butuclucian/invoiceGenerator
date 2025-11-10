import React from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { ArrowRight, CheckCircle, Quote, Star } from "lucide-react";
import BlurCircle from "../components/BlurCircle"
import API from "../utils/api";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";


const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="bg-[#0e0e0e] text-white overflow-x-hidden">
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="pt-40 pb-28 text-center relative">
        <BlurCircle top="0" right="0" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full mb-8 border border-white/20">
            <span className="text-sm text-[#80FFF9]">⚡ Powered by Gemini AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight bg-linear-to-r from-[#80FFF9] to-[#CB52D4] bg-clip-text text-transparent mb-6">
            Automate Invoicing with <br /> <span>Smart AI Precision</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto mb-10">
            BillForgeAI helps freelancers and small businesses generate, track,
            and send invoices instantly — no templates, no spreadsheets, no
            stress.
          </p>

          <div className="flex justify-center gap-4">
            <button onClick={()=> navigate('/register')} className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-full text-lg font-medium hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition-all text-lg font-light">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section
        id="features"
        className="py-28 relative bg-gradient-to-b from-[#0e0e0e] to-[#141414]"
      >
        <BlurCircle bottom="0" right="0" />
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Your AI Assistant for Effortless Invoicing
          </h2>
          <p className="text-white/70 mb-16 max-w-2xl mx-auto">
            BillForgeAI automates every step of the invoicing process so you can
            focus on what really matters — growing your business.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-[#80FFF9]/30 transition">
              <CheckCircle className="w-10 h-10 text-[#80FFF9] mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Invoice Parsing</h3>
              <p className="text-white/70 text-sm">
                Drop a document and let Gemini AI extract details instantly and
                error-free.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-[#80FFF9]/30 transition">
              <CheckCircle className="w-10 h-10 text-[#CB52D4] mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Client Management</h3>
              <p className="text-white/70 text-sm">
                Keep track of your clients, balances, and payment statuses in a
                centralized dashboard.
              </p>
            </div>

            <div className="p-8 bg-white/5 rounded-2xl border border-white/10 hover:border-[#80FFF9]/30 transition">
              <CheckCircle className="w-10 h-10 text-[#80FFF9] mb-4" />
              <h3 className="text-xl font-semibold mb-2">One-Click Export</h3>
              <p className="text-white/70 text-sm">
                Generate professional PDFs or share invoices directly with
                clients in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="stories"
        className="py-28 bg-gradient-to-t from-[#0e0e0e] to-[#141414] relative"
      >
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Trusted by Professionals Worldwide
          </h2>
          <p className="text-white/70 mb-16 max-w-2xl mx-auto">
            Thousands of freelancers and small teams rely on BillForgeAI for
            faster, smarter, and more reliable invoicing.
          </p>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Alex Johnson",
                role: "Freelance Designer",
                quote:
                  "BillForgeAI saves me hours every week. The AI extraction is insanely accurate!",
              },
              {
                name: "Sophia Lee",
                role: "Startup Founder",
                quote:
                  "Finally, invoicing that doesn’t feel like a chore. I can generate and send invoices in seconds.",
              },
              {
                name: "Daniel Brown",
                role: "Agency Manager",
                quote:
                  "Our team’s billing process is now automated and effortless. Highly recommend!",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-[#80FFF9]/30 transition"
              >
                <Quote className="text-[#80FFF9] w-8 h-8 mb-4 mx-auto" />
                <p className="text-white/80 italic mb-6">“{t.quote}”</p>
                <div className="text-sm font-medium">
                  {t.name} — <span className="text-white/60">{t.role}</span>
                </div>
                <div className="flex justify-center mt-3 text-[#CB52D4]">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} size={16} fill="#CB52D4" stroke="none" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING / SUBSCRIPTIONS ===== */}
      <section id="pricing" className="py-28 text-center bg-linear-to-r from-[#1a1a1a] via-[#111] to-[#1a1a1a] relative">
        <BlurCircle top="0" left="0" />
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Choose the Perfect Plan for You
          </h2>
          <p className="text-white/70 mb-16 max-w-2xl mx-auto">
            Unlock the full power of BillForgeAI — automate your invoicing and
            supercharge productivity with AI.
          </p>

          {/* === Pricing Cards === */}
          <div className="grid md:grid-cols-3 gap-10">
            {/* FREE PLAN */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-[#80FFF9]/40 transition shadow-lg shadow-black/20">
              <h3 className="text-2xl font-semibold mb-2 text-white">Free</h3>
              <p className="text-gray-400 mb-6 text-sm">For individuals starting out</p>
              <div className="text-4xl font-bold mb-6 text-[#80FFF9]">
                $0<span className="text-lg text-gray-400 font-medium"> /mo</span>
              </div>

              <ul className="text-left text-sm text-gray-300 space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[#80FFF9]" size={16} /> Up to 3 invoices/month
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[#80FFF9]" size={16} /> Basic client management
                </li>
                <li className="flex items-center gap-2 opacity-60">
                  <CheckCircle size={16} /> AI invoice generation (locked)
                </li>
              </ul>

              <button className="w-full py-3 rounded-md bg-white/10 text-gray-300 hover:text-white hover:bg-white/20 transition">
                Get Started
              </button>
            </div>

            {/* PRO PLAN */}
            <div className="p-8 bg-gradient-to-b from-indigo-600/20 to-purple-600/10 border border-[#80FFF9]/30 rounded-2xl relative hover:border-[#80FFF9]/50 transition shadow-lg shadow-indigo-900/20">
              <div className="absolute -top-3 right-4 bg-gradient-to-r from-[#80FFF9] to-[#CB52D4] text-xs font-medium px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-white">Pro</h3>
              <p className="text-gray-400 mb-6 text-sm">Perfect for freelancers & teams</p>
              <div className="text-4xl font-bold mb-6 text-[#80FFF9]">
                $9<span className="text-lg text-gray-400 font-medium"> /mo</span>
              </div>

              <ul className="text-left text-sm text-gray-300 space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[#80FFF9]" size={16} /> Unlimited invoices
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[#80FFF9]" size={16} /> Smart client analytics
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[#80FFF9]" size={16} /> AI invoice generation (unlocked)
                </li>
              </ul>

              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      toast.error("Please log in to upgrade your plan.");
                      window.location.href = "/login";
                      return;
                    }

                    const { data } = await API.post(
                      "/subscription/create-checkout-session",
                      { plan: "pro" },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );

                    if (data?.url) {
                      window.location.href = data.url; // redirect către Stripe
                    } else {
                      toast.error("Something went wrong starting checkout.");
                    }
                  } catch (err) {
                    console.error(err);
                    toast.error("Failed to start checkout.");
                  }
                }}
                className="w-full py-3 rounded-md bg-linear-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90 transition"
              >
                Upgrade to Pro
              </button>

            </div>

            {/* ENTERPRISE PLAN */}
            <div className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-[#CB52D4]/40 transition shadow-lg shadow-black/20">
              <h3 className="text-2xl font-semibold mb-2 text-white">Enterprise</h3>
              <p className="text-gray-400 mb-6 text-sm">For agencies & large companies</p>
              <div className="text-4xl font-bold mb-6 text-[#CB52D4]">
                $29<span className="text-lg text-gray-400 font-medium"> /mo</span>
              </div>

              <ul className="text-left text-sm text-gray-300 space-y-3 mb-8">
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[#CB52D4]" size={16} /> Team dashboard & reports
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[#CB52D4]" size={16} /> Priority AI processing
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="text-[#CB52D4]" size={16} /> Dedicated support
                </li>
              </ul>

              <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  if (!token) {
                    toast.error("Please log in to upgrade your plan.");
                    window.location.href = "/login";
                    return;
                  }

                  const { data } = await API.post(
                    "/subscription/create-checkout-session",
                    { plan: "enterprise" },
                    { headers: { Authorization: `Bearer ${token}` } }
                  );

                  if (data?.url) {
                    window.location.href = data.url; // redirect la Stripe
                  } else {
                    toast.error("Something went wrong starting checkout.");
                  }
                } catch (err) {
                  console.error(err);
                  toast.error("Failed to start checkout.");
                }
              }}
              className="w-full py-3 rounded-md bg-gradient-to-r from-[#CB52D4] to-[#80FFF9] text-white hover:opacity-90 transition"
            >
              Upgrade to Enterprise
            </button>

            </div>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
};

export default Home;
