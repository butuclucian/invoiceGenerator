import React, { useState, useEffect } from "react";
import { Brain, Sparkles, RefreshCw, BarChart2, ShieldCheck, FileText, Trash2, Eye, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import API from "../../utils/api";
import { toast } from "sonner";

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
    }, 2);
    return () => clearInterval(interval);
  }, [text]);

  return <div className="whitespace-pre-line text-gray-200 leading-relaxed text-sm md:text-base font-normal">{displayedText}</div>;
};

const AiInsights = () => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState("");

  const [reportHistory, setReportHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);


  const fetchReportHistory = async () => {
    setHistoryLoading(true);
    try {
      const { data } = await API.get("/invoices/analytics/ai/history");
      if (data.success) {
        setReportHistory(data.history || []);
      }
    } catch (error) {
      console.error("Eroare la încărcarea istoricului de rapoarte:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    setReport("");
    try {
      const { data } = await API.get("/invoices/analytics/ai");
      if (data.success) {
        setReport(data.report);
        toast.success("Analiza financiară a fost generată cu succes!");
        fetchReportHistory();
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

  const handleDeleteHistory = async (id) => {
    try {
      const { data } = await API.delete(`/invoices/analytics/ai/history/${id}`);
      if (data.success) {
        toast.success("Raportul a fost eliminat din istoric.");
        setReportHistory((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (error) {
      toast.error("Nu s-a putut șterge raportul.");
    }
  };

  const handleViewReport = (savedReportText) => {
    setReport(savedReportText);
    window.scrollTo({ top: 400, behavior: "smooth" });
    toast.info("S-a încărcat raportul selectat din istoric.");
  };

  useEffect(() => {
    fetchReportHistory();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-10 overflow-hidden pb-16 p-8 pt-30 space-y-8">

      <div className="absolute top-20 right-10 w-72 h-72 bg-teal-500/10 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-purple-600/10 blur-3xl rounded-full pointer-events-none" />


      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="text-3xl font-semibold text-white flex items-center gap-2">
            <Brain className="text-[#80FFF9]" size={26} />
            AI Financial Insights
          </div>
          <p className="text-gray-400 text-sm mt-1">
            Analiză strategică locală bazată pe registrul tău de facturi fiscale.
          </p>
        </div>

        <button onClick={generateReport} disabled={loading} 
        className="flex items-center justify-center gap-2 px-5 py-3 
            bg-linear-to-r from-teal-500/20 to-indigo-600/20 
            hover:from-teal-500/30 hover:to-indigo-600/30 
            border border-teal-500/30 hover:border-teal-400/60 
            rounded-full transition duration-300 font-medium text-sm
            shadow-[0_0_15px_rgba(20,184,166,0.1)] hover:shadow-[0_0_20px_rgba(20,184,166,0.2)]
            disabled:opacity-50 disabled:cursor-not-allowed">
          {loading ? (
            <>
              <RefreshCw className="animate-spin text-[#80FFF9]" size={16} />
              <span>Se analizează datele...</span>
            </>
          ) : (
            <>
              <Sparkles className="text-[#80FFF9]" size={16} />
              <span>Generează Raport</span>
            </>
          )}
        </button>
      </div>

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

      <div className="relative z-10 mb-12">
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
              <p className="text-sm text-gray-500">
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
                bg-linear-to-b from-[#161616]/90 to-[#121212]/90 
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

              <TypewriterText text={report} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative z-10 max-w-3xl mx-auto mt-16 border-t border-white/5 pt-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <FileText className="text-purple-400" size={18} />
            <h2 className="text-base font-bold text-gray-200">Jurnalul Rapoartelor Salvate</h2>
          </div>
          <span className="text-xs font-mono text-gray-500 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
            {reportHistory.length} analize salvate
          </span>
        </div>

        {historyLoading ? (
          <div className="flex items-center justify-center py-6 text-gray-500 gap-2">
            <RefreshCw className="animate-spin text-purple-400" size={16} />
            <span className="text-xs font-mono uppercase tracking-wider">Se încarcă istoricul...</span>
          </div>
        ) : reportHistory.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8 border border-dashed border-white/5 rounded-2xl bg-[#121212]/20">
            Nu există rapoarte anterioare stocate. Generează o analiză nouă pentru a începe istoricul.
          </p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {reportHistory.map((hist) => (
                <motion.div
                  key={hist._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-[#141414]/80 border border-white/5 p-4 rounded-xl flex items-center justify-between hover:border-white/10 transition group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-purple-400">
                      <Brain size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white group-hover:text-purple-400 transition">
                        {hist.title || `Analiză Financiară #${hist._id.substring(hist._id.length - 6)}`}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5 font-mono">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(hist.createdAt).toLocaleDateString("ro-RO")} 
                          <span className="ml-1 text-[10px] text-gray-600">
                            {new Date(hist.createdAt).toLocaleTimeString("ro-RO", { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </span>
                        <span>•</span>
                        <span className="text-teal-500/80">Llama 3.1 Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewReport(hist.report || hist.content)}
                      className="p-2 text-gray-400 hover:text-[#80FFF9] bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg transition"
                      title="Încarcă Raportul"
                    >
                      <Eye size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteHistory(hist._id)}
                      className="p-2 text-gray-500 hover:text-red-400 bg-red-500/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 rounded-lg transition"
                      title="Șterge Raport"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiInsights;