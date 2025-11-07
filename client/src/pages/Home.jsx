import React from "react";
import Navbar from "../components/Home/Navbar";
import Footer from "../components/Home/Footer";
import { ArrowRight, CheckCircle, Quote, Star } from "lucide-react";
import Stats from "../components/Home/Stats";
import BlurCircle from "../components/BlurCircle"

const Home = () => {
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
            <button className="bg-linear-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-full text-lg font-medium hover:shadow-indigo-500/40 hover:-translate-y-[2px] transition-all flex items-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border border-white/20 px-8 py-4 rounded-full hover:bg-white/10 transition-all text-lg font-light">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <Stats />

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

      {/* ===== TESTIMONIALS ===== */}
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

      {/* ===== CTA FINAL ===== */}
      <section className="py-28 text-center bg-gradient-to-r from-[#1a1a1a] via-[#111] to-[#1a1a1a] relative">
        <BlurCircle top="0" left="0" />
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            Ready to Simplify Your Workflow?
          </h2>
          <p className="text-white/70 mb-10">
            Join thousands of professionals who trust BillForgeAI to automate
            their billing and boost productivity.
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 px-10 py-4 rounded-full text-lg font-medium hover:shadow-indigo-500/40 hover:-translate-y-[2px] transition-all flex items-center gap-2 mx-auto">
            Start Free Today
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <Footer />
    </div>
  );
};

export default Home;
