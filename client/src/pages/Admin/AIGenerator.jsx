import React, { useState, useEffect } from "react";
import {
  Brain, Loader2, FileText, RotateCcw, Download, Lock, Sparkles,
  Plus, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckCircle2,
  Clock, Settings, X, Edit2,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import API from "../../utils/api";
import logo from "../../assets/invoicelogo.png";

// ── Prețuri default (sincronizate cu backend-ul) ──────────────────────────────
const DEFAULT_PRICES = [
  { service: "web design", price: 500 },
  { service: "web development", price: 800 },
  { service: "web app", price: 1200 },
  { service: "mobile app", price: 1500 },
  { service: "ui/ux analiza", price: 100 },
  { service: "ux research", price: 150 },
  { service: "seo", price: 200 },
  { service: "logo design", price: 150 },
  { service: "branding", price: 300 },
  { service: "landing page", price: 350 },
  { service: "e-commerce", price: 1200 },
  { service: "maintenance", price: 100 },
  { service: "consulting", price: 80 },
];

// ── Badge status ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    draft: { label: "Draft", icon: Clock, cls: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
    pending_review: { label: "Needs Review", icon: AlertCircle, cls: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
    ready: { label: "Ready", icon: CheckCircle2, cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  };
  const s = map[status] || map.draft;
  const Icon = s.icon;
  return (
    <span className={`flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border ${s.cls}`}>
      <Icon size={12} />
      {s.label}
    </span>
  );
};

// ── Card rezultat invoice ──────────────────────────────────────────────────────
const InvoiceResultCard = ({ result, onProcess }) => {
  const { invoice, ai_status, missing_fields = [], items_with_unknown_price = [] } = result;
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`bg-[#1a1a1a]/80 border rounded-xl p-5 transition-all ${
      ai_status === "ready"
        ? "border-emerald-500/30 hover:border-emerald-500/50"
        : "border-amber-500/30 hover:border-amber-500/50"
    }`}>

      {/* Card header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-white truncate">
              {invoice.invoice_number}
            </span>
            <StatusBadge status={ai_status} />
          </div>
          <p className="text-sm text-gray-400 truncate">
            {invoice.client?.name || "Unknown Client"}
          </p>
          {invoice.client?.email && (
            <p className="text-xs text-gray-500 truncate">{invoice.client.email}</p>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-semibold text-[#80FFF9]">
            {Number(invoice.total || 0).toFixed(2)} RON
          </p>
          <p className="text-xs text-gray-500">
            {invoice.date ? new Date(invoice.date).toISOString().split("T")[0] : ""}
          </p>
        </div>
      </div>

      {/* Missing fields warning */}
      {missing_fields.length > 0 && (
        <div className="flex items-start gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-3">
          <AlertCircle size={14} className="text-amber-400 mt-0.5 shrink-0" />
          <div className="text-xs text-amber-300">
            <span className="font-medium">Date lipsă: </span>
            {missing_fields.map((f) => f.replace(/_/g, " ")).join(", ")}
          </div>
        </div>
      )}

      {/* Unknown prices warning */}
      {items_with_unknown_price.length > 0 && (
        <div className="flex items-start gap-2 bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 mb-3">
          <AlertCircle size={14} className="text-orange-400 mt-0.5 shrink-0" />
          <div className="text-xs text-orange-300">
            <span className="font-medium">Prețuri necunoscute: </span>
            {items_with_unknown_price.join(", ")}
          </div>
        </div>
      )}

      {/* Items preview */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-xs text-gray-400 hover:text-gray-200 transition mb-2"
      >
        <span>{invoice.items?.length || 0} servicii/produse</span>
        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {expanded && (
        <div className="border-t border-white/10 pt-3 mb-3 space-y-2">
          {invoice.items?.map((item, i) => (
            <div key={i} className="flex justify-between text-xs">
              <span className="text-gray-300 flex-1 truncate">{item.description}</span>
              <span className="text-gray-500 mx-3">×{item.quantity}</span>
              <span className={item.unit_price === 0 ? "text-orange-400" : "text-[#80FFF9]"}>
                {item.unit_price === 0 ? "preț lipsă" : `${Number(item.total).toFixed(2)} RON`}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-xs pt-2 border-t border-white/10 font-medium">
            <span className="text-gray-400">Total</span>
            <span className="text-white">{Number(invoice.total).toFixed(2)} RON</span>
          </div>
        </div>
      )}

      {/* Review & Approve Button */}
      <button
        type="button"
        onClick={() => onProcess(result)}
        className="w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 text-indigo-300 transition"
      >
        <Edit2 size={14} />
        Revizuiește & Emite Factura
      </button>
    </div>
  );
};

// ── Componenta principală ─────────────────────────────────────────────────────
const AIGenerator = () => {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("Free");
  const [checking, setChecking] = useState(true);

  // Price editor
  const [showPrices, setShowPrices] = useState(false);
  const [prices, setPrices] = useState(DEFAULT_PRICES);
  const [newService, setNewService] = useState("");
  const [newPrice, setNewPrice] = useState("");

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setPlan("Free"); setChecking(false); return; }
        const { data } = await API.get("/subscription/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPlan(data?.plan || "Free");
      } catch {
        setPlan("Free");
      } finally {
        setChecking(false);
      }
    };
    checkSubscription();
  }, []);

  // ── Generare Locală cu Ollama ───────────────────────────────────────────────
  const handleExtract = async () => {
    if (!text.trim()) { toast.error("Introduce text mai întâi!"); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const customPrices = Object.fromEntries(prices.map((p) => [p.service, p.price]));

      const { data } = await API.post(
        "/ai/generate-invoice",
        { text, customPrices },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.success) {
        setResults((prev) => [data, ...prev]);
        const statusMsg = {
          ready: "✅ Document compilat de LLM complet!",
          pending_review: "⚠️ Date parțiale — necesită revizuirea prețurilor.",
          draft: "📋 Structură salvată ca draft.",
        };
        toast.success(statusMsg[data.ai_status] || "Document compilat local!");
        setText("");
      } else {
        toast.error("AI-ul local nu a extras o structură validă");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Ollama local LLM request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleProcessInvoice = (result) => {
    const { invoice } = result;
    
    const aiData = {
      serviciu_prestat: invoice.items?.[0]?.description || "",
      suma: invoice.items?.[0]?.unit_price || 0,
      mesaj_notificare: invoice.notes || ""
    };

    navigate("/dashboard/invoices/create", {
      state: {
        aiData,
        isAiPending: true,
        invoiceId: invoice._id
      }
    });
  };

  const handleReset = () => {
    setText("");
    setResults([]);
    toast.info("Resetat");
  };

  const handleRemoveResult = (idx) => {
    setResults((prev) => prev.filter((_, i) => i !== idx));
  };

  // ── Price editor helpers ─────────────────────────────────────────────────────
  const handleAddPrice = () => {
    if (!newService.trim() || !newPrice) return;
    setPrices((prev) => [...prev, { service: newService.trim().toLowerCase(), price: Number(newPrice) }]);
    setNewService("");
    setNewPrice("");
  };

  const handleRemovePrice = (idx) => {
    setPrices((prev) => prev.filter((_, i) => i !== idx));
  };

  const handlePriceChange = (idx, field, value) => {
    setPrices((prev) => prev.map((p, i) => i === idx ? { ...p, [field]: field === "price" ? Number(value) : value } : p));
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-gray-400">
        Checking subscription...
      </div>
    );
  }

  // Blocajele legate de planul subscripției au fost eliminate complet.
  // Interfața se va afișa din start pentru toți utilizatorii în modul local de dezvoltare.
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 md:px-10 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <Brain className="text-[#80FFF9]" size={26} />
            AI Invoice Generator (Ollama Local)
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Introduce orice text — email, mesaj, cerere — și AI-ul local generează structura facturii securizat.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full border border-[#80FFF9]/30 bg-[#80FFF9]/10 text-[#80FFF9] text-sm">
            Local LLM Active ({plan})
          </div>
          <button
            onClick={() => setShowPrices(!showPrices)}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 text-sm transition"
          >
            <Settings size={15} />
            Prețuri
          </button>
        </div>
      </div>

      {/* ── Price editor panel ──────────────────────────────────────────────────── */}
      {showPrices && (
        <div className="mb-8 bg-[#141414] border border-white/10 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
            <h3 className="font-semibold text-white flex items-center gap-2">
              <Settings size={16} className="text-[#80FFF9]" />
              Listă prețuri servicii
            </h3>
            <button onClick={() => setShowPrices(false)} className="text-gray-400 hover:text-white transition">
              <X size={18} />
            </button>
          </div>

          <div className="p-6">
            <p className="text-gray-400 text-sm mb-4">
              AI-ul va folosi aceste prețuri când detectează serviciile în text. Modifică oricând.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              {prices.map((p, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2">
                  <input
                    value={p.service}
                    onChange={(e) => handlePriceChange(idx, "service", e.target.value)}
                    className="flex-1 bg-transparent text-sm text-gray-200 outline-none min-w-0"
                  />
                  <span className="text-gray-500 text-sm">€</span>
                  <input
                    type="number"
                    value={p.price}
                    onChange={(e) => handlePriceChange(idx, "price", e.target.value)}
                    className="w-20 bg-transparent text-sm text-[#80FFF9] text-right outline-none"
                  />
                  <button onClick={() => handleRemovePrice(idx)} className="text-gray-600 hover:text-red-400 transition">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mt-2">
              <input
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Nume serviciu..."
                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-gray-200 outline-none focus:border-[#80FFF9]/50 placeholder-gray-600"
              />
              <input
                type="number"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="€"
                className="w-24 bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#80FFF9] outline-none focus:border-[#80FFF9]/50 placeholder-gray-600"
              />
              <button
                onClick={handleAddPrice}
                disabled={!newService.trim() || !newPrice}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 text-indigo-300 text-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Plus size={15} />
                Adaugă
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Textarea + buttons ──────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Introdu orice text... Exemple:\n• "Salut, sunt firma SC Laptop SRL, am nevoie de web design cu 7 pagini și o analiză UI/UX."\n• "Hi, I need a landing page and SEO optimization for my shop. Contact: john@shop.com"`}
            className="w-full h-52 bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-600 focus:border-[#80FFF9]/50 outline-none transition resize-none text-sm leading-relaxed"
          />
          {text && (
            <button
              onClick={() => setText("")}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-400 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex justify-center gap-4 mt-5">
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 border border-white/20 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition disabled:opacity-50 text-sm"
          >
            <RotateCcw size={15} />
            Reset tot
          </button>

          <button
            onClick={handleExtract}
            disabled={loading || !text.trim()}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={15} /> Compiling...</>
            ) : (
              <><FileText size={15} /> Generează Invoice</>
            )}
          </button>
        </div>
      </div>

      {/* ── Results grid ─────────────────────────────────────────────────────────── */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText size={18} className="text-[#80FFF9]" />
              Propuneri facturi din text local
              <span className="ml-1 text-sm font-normal text-gray-400">({results.length})</span>
            </h2>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Ready
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Needs review
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-500"></span> Draft
              </span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, idx) => (
              <div key={idx} className="relative">
                <button
                  onClick={() => handleRemoveResult(idx)}
                  className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-400/40 transition"
                >
                  <X size={12} />
                </button>
                <InvoiceResultCard result={result} onProcess={handleProcessInvoice} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {results.length === 0 && !loading && (
        <div className="max-w-4xl mx-auto text-center py-12 border border-dashed border-white/10 rounded-2xl">
          <Brain size={40} className="text-white/10 mx-auto mb-3" />
          <p className="text-gray-600 text-sm">
            Propunerile analizate de LLM local vor apărea aici
          </p>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;