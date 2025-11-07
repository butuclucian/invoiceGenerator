import React from "react";
import { Sparkles, ArrowRight, PlayCircle } from "lucide-react";
import BlurCircle from "../BlurCircle";

const Hero = () => {
  return (
    <div className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        {/* Tag AI */}
        <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-full mb-8 border border-white/20 shadow-sm">
          <Sparkles className="w-4 h-4 text-teal-300 animate-pulse" />
          <span className="text-sm font-light tracking-wide">
            Powered by <span className="font-semibold">Gemini AI</span>
          </span>
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 bg-linear-to-r from-[#80FFF9] via-[#9F7AEA] to-[#F7E7D9] bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(255,255,255,0.25)]">
          Automate Your Invoices.
          <br />
          <span className="bg-linear-to-r from-[#CB52D4] to-[#80FFF9] bg-clip-text text-transparent">
            Smarter. Faster. Effortless.
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
          Meet <span className="text-[#80FFF9] font-medium">BillForge</span> —
          your AI-powered invoice assistant. Generate, organize, and send
          invoices in seconds — no templates, no stress, just pure automation.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button className="group relative inline-flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-lg px-8 py-4 rounded-full shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-1">
            <span>Get Started Free</span>
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <button className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300">
            <PlayCircle className="w-5 h-5 text-[#80FFF9]" />
            <span>Watch how it works</span>
          </button>
        </div>
      </div>

      {/* Glowing background blur circles */}
      <BlurCircle top="-100px" right="-100px" />
      <BlurCircle bottom="0px" left="0px" />
    </div>
  );
};

export default Hero;
