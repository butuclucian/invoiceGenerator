import React, { useState, useRef, useEffect } from "react";
import {
  Brain, Loader2, FileText, RotateCcw, Download, Lock, Sparkles,
  Plus, Trash2, ChevronDown, ChevronUp, AlertCircle, CheckCircle2,
  Clock, Settings, X, Edit2,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
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
const InvoiceResultCard = ({ result, onDownload }) => {
  const { invoice, ai_status, missing_fields = [], items_with_unknown_price = [] } = result;
  const [expanded, setExpanded] = useState(false);

  const isDownloadable = ai_status === "ready" || ai_status === "pending_review";

  return (
    <div className={`bg-[#1a1a1a]/80 border rounded-xl p-5 transition-all ${
      ai_status === "ready"
        ? "border-emerald-500/30 hover:border-emerald-500/50"
        : ai_status === "pending_review"
        ? "border-amber-500/30 hover:border-amber-500/50"
        : "border-white/10 hover:border-white/20"
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
            €{Number(invoice.total || 0).toFixed(2)}
          </p>
          <p className="text-xs text-gray-500">{invoice.date}</p>
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
                {item.unit_price === 0 ? "preț lipsă" : `€${Number(item.total).toFixed(2)}`}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-xs pt-2 border-t border-white/10 font-medium">
            <span className="text-gray-400">Total</span>
            <span className="text-white">€{Number(invoice.total).toFixed(2)}</span>
          </div>
        </div>
      )}

      {/* Download button */}
      <button
        onClick={() => onDownload(result)}
        disabled={!isDownloadable}
        className={`w-full mt-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition ${
          isDownloadable
            ? "bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 text-indigo-300"
            : "bg-white/5 border border-white/10 text-gray-600 cursor-not-allowed"
        }`}
      >
        <Download size={14} />
        {isDownloadable ? "Download PDF" : "Completează datele lipsă"}
      </button>
    </div>
  );
};

// ── Componenta principală ─────────────────────────────────────────────────────
const AIGenerator = () => {
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

  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) { toast.error("Please log in"); window.location.href = "/login"; return; }
      const { data } = await API.post(
        "/subscription/create-checkout-session",
        { plan: "pro" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.url) { toast.loading("Redirecting..."); window.location.href = data.url; }
      else toast.error("Failed to start checkout.");
    } catch { toast.error("Stripe checkout failed."); }
  };

  // ── Generare ────────────────────────────────────────────────────────────────
  const handleExtract = async () => {
    if (!text.trim()) { toast.error("Introduce text mai întâi!"); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      // Trimitem și prețurile custom către backend
      const customPrices = Object.fromEntries(prices.map((p) => [p.service, p.price]));

      const { data } = await API.post(
        "/ai/generate-invoice",
        { text, customPrices },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.success) {
        setResults((prev) => [data, ...prev]);
        const statusMsg = {
          ready: "✅ Invoice generat complet!",
          pending_review: "⚠️ Invoice generat — verifică prețurile lipsă.",
          draft: "📋 Draft creat — lipsesc unele date.",
        };
        toast.success(statusMsg[data.ai_status] || "Invoice generat!");
        setText("");
      } else {
        toast.error("AI nu a returnat date valide");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "AI request failed");
    } finally {
      setLoading(false);
    }
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

  // ── Download PDF ─────────────────────────────────────────────────────────────
  const handleDownloadPDF = async (result) => {
    const { invoice } = result;
    if (!invoice) return toast.error("Nu există invoice de exportat!");

    try {
      const doc = new jsPDF("p", "mm", "a4");
      const accent = [58, 110, 165];
      const gray = [60, 60, 60];
      const link = `${window.location.origin}/dashboard/invoices/${invoice._id}`;

      const img = new Image();
      img.src = logo;
      await new Promise((res) => (img.onload = res));
      doc.addImage(img, "PNG", 15, 10, 20, 20);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(22);
      doc.text("BillForge AI", 40, 17);
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text("Smart Invoice Generator", 40, 23);

      const qrDataUrl = await QRCode.toDataURL(link);
      doc.addImage(qrDataUrl, "PNG", 170, 10, 25, 25);

      let y = 50;
      doc.setDrawColor(40, 70, 120);
      doc.line(15, y - 8, 195, y - 8);

      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accent);
      doc.text("From:", 15, y);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);
      y += 6;
      doc.text("BillForge AI Inc.", 15, y);
      doc.text("123 Innovation Blvd", 15, (y += 5));
      doc.text("Timisoara, Romania", 15, (y += 5));
      doc.text("support@billforge.ai", 15, (y += 5));

      let rightY = 50;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accent);
      doc.text("Bill To:", 120, rightY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);
      rightY += 6;

      const client = invoice.client || {};
      doc.text(client.name || "Unknown Client", 120, rightY);
      if (client.company && client.company !== client.name) { rightY += 5; doc.text(client.company, 120, rightY); }
      if (client.email) { rightY += 5; doc.text(client.email, 120, rightY); }
      if (client.address) { rightY += 5; doc.text(client.address, 120, rightY); }

      const infoY = Math.max(y, rightY) + 15;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accent);
      doc.text("Invoice Details:", 15, infoY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);
      doc.text(`Invoice Number: ${invoice.invoice_number}`, 15, infoY + 6);
      doc.text(`Date: ${invoice.date}`, 15, infoY + 12);
      doc.text(`Due Date: ${invoice.due_date || "-"}`, 15, infoY + 18);
      doc.text(`Status: ${invoice.status}`, 15, infoY + 24);

      const items = invoice.items?.map((item) => [
        item.description,
        item.quantity,
        `€${Number(item.unit_price).toFixed(2)}`,
        `€${Number(item.total).toFixed(2)}`,
      ]) || [["No items found", "-", "-", "-"]];

      autoTable(doc, {
        startY: infoY + 35,
        head: [["Description", "Quantity", "Unit Price", "Total"]],
        body: items,
        theme: "grid",
        headStyles: { fillColor: accent, textColor: [255, 255, 255], fontStyle: "bold" },
        styles: { halign: "center", textColor: [50, 50, 50], lineColor: [180, 180, 180], fontSize: 10, fillColor: [245, 247, 250] },
        alternateRowStyles: { fillColor: [250, 250, 250] },
        margin: { left: 15, right: 15 },
      });

      const finalY = doc.lastAutoTable.finalY || infoY + 60;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(...accent);
      doc.text("Summary", 140, finalY + 10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);
      doc.text("Subtotal:", 140, finalY + 18);
      doc.text(`€${Number(invoice.subtotal || 0).toFixed(2)}`, 175, finalY + 18);
      doc.text("Tax Rate:", 140, finalY + 24);
      doc.text(`${invoice.tax_rate}%`, 175, finalY + 24);
      doc.text("Discount:", 140, finalY + 30);
      doc.text(`${invoice.discount_rate}%`, 175, finalY + 30);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(...accent);
      doc.text("Total:", 140, finalY + 40);
      doc.text(`€${Number(invoice.total || 0).toFixed(2)}`, 175, finalY + 40);

      if (invoice.notes) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...accent);
        doc.text("Notes:", 15, finalY + 50);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...gray);
        doc.text(invoice.notes, 15, finalY + 58, { maxWidth: 180 });
      }

      const signY = finalY + 90;
      doc.setDrawColor(180, 180, 180);
      doc.line(25, signY, 85, signY);
      doc.line(125, signY, 185, signY);
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text("Client Signature", 35, signY + 6);
      doc.text("Authorized Signature", 135, signY + 6);

      doc.setFontSize(9);
      doc.setTextColor(150, 150, 150);
      doc.text("Generated by BillForge AI • www.billforge.app", 15, 290);

      doc.save(`invoice_${invoice.invoice_number}.pdf`);
      toast.success("PDF descărcat!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  // ── Subscription checks ──────────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-gray-400">
        Checking subscription...
      </div>
    );
  }

  const aiUnlocked = plan === "Pro" || plan === "Enterprise";
  if (!aiUnlocked) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] text-white flex items-center justify-center px-6">
        <div className="bg-[#111]/90 border border-white/10 rounded-2xl p-10 text-center max-w-md shadow-lg shadow-indigo-600/20">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <Lock className="text-[#80FFF9]" size={30} />
          </div>
          <h2 className="text-2xl font-semibold mb-2">AI Generator Locked</h2>
          <p className="text-gray-400 mb-6">
            Upgrade to <span className="text-[#80FFF9]">Pro</span> or{" "}
            <span className="text-[#CB52D4]">Enterprise</span> to unlock AI-powered invoice generation.
          </p>
          <button
            onClick={handleUpgrade}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-md mx-auto hover:opacity-90 transition"
          >
            <Sparkles size={16} /> Upgrade Now
          </button>
        </div>
      </div>
    );
  }

  // ── RENDER ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-6 md:px-10 py-10">

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <Brain className="text-[#80FFF9]" size={26} />
            AI Invoice Generator
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Introduce orice text — email, mesaj, cerere — și AI-ul generează invoice-ul.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full border border-[#80FFF9]/30 bg-[#80FFF9]/10 text-[#80FFF9] text-sm">
            {plan} Plan
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

            {/* Price list */}
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

            {/* Add new */}
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
              <><Loader2 className="animate-spin" size={15} /> Generez...</>
            ) : (
              <><FileText size={15} /> Generează Invoice</>
            )}
          </button>
        </div>
      </div>

      {/* ── Results grid ─────────────────────────────────────────────────────────── */}
      {results.length > 0 && (
        <div className="max-w-6xl mx-auto">

          {/* Results header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <FileText size={18} className="text-[#80FFF9]" />
              Invoice-uri generate
              <span className="ml-1 text-sm font-normal text-gray-400">({results.length})</span>
            </h2>

            {/* Legend */}
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

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {results.map((result, idx) => (
              <div key={idx} className="relative">
                {/* Remove button */}
                <button
                  onClick={() => handleRemoveResult(idx)}
                  className="absolute -top-2 -right-2 z-10 w-6 h-6 rounded-full bg-[#1a1a1a] border border-white/20 flex items-center justify-center text-gray-500 hover:text-red-400 hover:border-red-400/40 transition"
                >
                  <X size={12} />
                </button>
                <InvoiceResultCard result={result} onDownload={handleDownloadPDF} />
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
            Invoice-urile generate vor apărea aici
          </p>
        </div>
      )}
    </div>
  );
};

export default AIGenerator;