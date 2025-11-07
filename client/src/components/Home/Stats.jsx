import React from "react";
import { Brain, Timer, Infinity, Globe } from "lucide-react";

const stats = [
  {
    icon: <Timer className="w-6 h-6 text-[#80FFF9]" />,
    value: "2s",
    label: "Average Invoice Time",
  },
  {
    icon: <Brain className="w-6 h-6 text-[#80FFF9]" />,
    value: "99%",
    label: "AI Parsing Accuracy",
  },
  {
    icon: <Globe className="w-6 h-6 text-[#80FFF9]" />,
    value: "24/7",
    label: "Uptime & Support",
  },
  {
    icon: <Infinity className="w-6 h-6 text-[#80FFF9]" />,
    value: "∞",
    label: "Invoices Generated",
  },
];

const Stats = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 blur-[120px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-4">
          Smarter Numbers. Real Results.
        </h2>
        <p className="text-white/70 text-sm md:text-base max-w-2xl mx-auto mb-12">
          BillForgeAI empowers your business with real-time automation and
          efficiency powered by Gemini AI.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12 max-w-4xl mx-auto">
          {stats.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center group transition-all duration-300 hover:scale-105"
            >
              <div className="mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-white/10 border border-white/20 group-hover:bg-[#80FFF9]/10 transition">
                {item.icon}
              </div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#80FFF9] to-[#CB52D4] bg-clip-text text-transparent">
                {item.value}
              </div>
              <div className="text-white/70 mt-2 text-sm font-light">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
