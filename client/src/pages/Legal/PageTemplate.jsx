import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BlurCircle from "../../components/BlurCircle";

const PageTemplate = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-[#0e0e0e] text-white min-h-screen pt-32 pb-20 relative overflow-hidden">

      {/* Blur Lights */}
      <BlurCircle top="-100px" left="15%" size="380px" color="#80FFF930" />
      <BlurCircle bottom="-80px" right="10%" size="400px" color="#CB52D430" />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 text-center relative z-10 mb-20">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute left-6 -top-10 flex items-center gap-2 text-gray-300 hover:text-[#80FFF9] transition"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#80FFF9] to-[#CB52D4] text-transparent bg-clip-text">
          {title}
        </h1>

        {subtitle && (
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* Content Card */}
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-xl shadow-black/20 leading-relaxed text-white/80 text-lg">
          {children}
        </div>
      </div>

    </div>
  );
};

export default PageTemplate;
