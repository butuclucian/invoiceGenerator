import React, { useState } from "react";
import { Brain, Sparkles, RefreshCw, BarChart2, ShieldCheck, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../utils/api"; // Ajustează calea către utilitarul tău API dacă e cazul
import { toast } from "sonner";

// Componentă internă pentru efectul de scriere la mașină (Typing Effect)
const TypewriterText = ({ text }) => {
  const [displayedText, setDisplayedText] = React.useState("");
  
  React.useEffect(() => {
    let index = 0;
    setDisplayedText("");
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 5); // Viteza de scriere (mai mic = mai rapid)
    return () => clearInterval(interval);
  }, [text]);

  return <div className="whitespace-pre-line text-gray-200 leading-relaxed text-sm md:text-base font-normal">{displayedText}</div>;
};

const AiInsights = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");

  const generateReport = async () => {
    setLoading(true);
    setReport("");
    try {
      // Apelăm endpoint-ul nou creat în backend
      const { data } = await API.get("/invoices/analytics/ai");
      if (data.success) {
        setReport(data.report);
        toast.success("Analiza financiară a fost generată cu succes!");
      } else {
        toast.error("Nu s-a putut genera raportul.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Eroare la comunicarea cu AI-ul local.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-[#0d0d0d] text-white pt-24">
      {/* Background Glows decorative */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-white/5 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-[#80FFF9] mb-1">
            <Brain size={20} className="animate-pulse" />
            <span className="text-xs uppercase tracking-widest font-mono font-bold">Business Intelligence</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-500">
            AI Financial Insights
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Analiză strategică locală bazată pe registrul tău de facturi fiscale.
          </p>
        </div>

        <button
          onClick={generateReport}
          disabled={loading}
          className="
            flex items-center justify-center gap-2 px-5 py-3 
            bg-gradient-to-r from-teal-500/20 to-indigo-600/20 
            hover:from-teal-500/30 hover:to-indigo-600/30 
            border border-teal-500/30 hover:border-teal-400/60 
            rounded-full transition duration-300 font-medium text-sm
            shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]
            disabled:opacity-50 disabled:cursor-not-allowed
          "
        >
          {loading ? (
            <>
              <RefreshCw className="animate-spin text-[#80FFF9]" size={16} />
              <span>Se analizează datele...</span>
            </>
          ) : (
            <>
              <Sparkles className="text-[#80FFF9]" size={16} />
              <span>Generează Raport AI</span>
            </>
          )}
        </button>
      </div>

      {/* METRICS INFO GARANȚIE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 relative z-10">
        <div className="bg-[#151515]/60 border border-white/5 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-teal-500/10 border border-teal-500/20 rounded-xl text-teal-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <h4 className="text-xs text-gray-400 font-medium">Securitate Maximă</h4>
            <p className="text-[11px] text-gray-500">Procesat local via Llama 3.1</p>
          </div>
        </div>

        <div className="bg-[#151515]/60 border border-white/5 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <BarChart2 size={20} />
          </div>
          <div>
            <h4 className="text-xs text-gray-400 font-medium">Predicție Cashflow</h4>
            <p className="text-[11px] text-gray-500">Algoritm bazat pe comportament</p>
          </div>
        </div>

        <div className="bg-[#151515]/60 border border-white/5 backdrop-blur-xl p-4 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
            <FileText size={20} />
          </div>
          <div>
            <h4 className="text-xs text-gray-400 font-medium">Optimizare Organizațională</h4>
            <p className="text-[11px] text-gray-500">Recomandări de risc structurate</p>
          </div>
        </div>
      </div>

      {/* MAIN REPORT AREA */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {!loading && !report && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="border border-white/5 bg-[#121212]/40 backdrop-blur-xl rounded-2xl p-12 text-center max-w-2xl mx-auto flex flex-col items-center"
            >
              <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-4">
                <Brain size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Gata pentru Analiza Financiară</h3>
              <p className="text-sm text-gray-400 mb-6 max-w-md">
                Apasă butonul de mai sus pentru a trimite istoricul tău tranzacțional către modelul neural de limbaj. AI-ul va compila automat indicatorii de performanță.
              </p>
            </motion.div>
          )}

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4 max-w-3xl mx-auto"
            >
              {/* Skeletone loaders animate-pulse cu glassmorphic style */}
              <div className="h-6 bg-white/5 border border-white/5 rounded-full w-1/3 animate-pulse" />
              <div className="h-24 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
              <div className="h-6 bg-white/5 border border-white/5 rounded-full w-1/4 animate-pulse pt-4" />
              <div className="h-32 bg-white/5 border border-white/5 rounded-2xl animate-pulse" />
            </motion.div>
          )}

          {!loading && report && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="
                max-w-3xl mx-auto 
                bg-gradient-to-b from-[#161616]/90 to-[#121212]/90 
                border border-white/10 p-6 md:p-8 rounded-2xl 
                shadow-[0_20px_50px_rgba(0,0,0,0.5)] backdrop-blur-2xl
              "
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-teal-400 rounded-full animate-ping" />
                  <span className="text-xs font-mono text-gray-400 uppercase tracking-wider">Raport Executiv Generat Local</span>
                </div>
                <span className="text-[10px] bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full font-mono">
                  LLM: Llama 3.1 8B
                </span>
              </div>

              {/* Randăm raportul cu efectul de mașină de scris */}
              <TypewriterText text={report} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AiInsights;