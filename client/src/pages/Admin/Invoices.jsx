import React, { useEffect, useState } from "react";
import { FileText, Edit, Trash2, Download, Filter, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { useSearchStore } from "../../store/useSearchStore";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [billingProfile, setBillingProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const formatCurrency = (value, currency = "RON") => {
  if (!value && value !== 0) return `0,00 ${currency}`;

  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  })
    .format(value)
    .replace(/\s/g, " ");
  };
  
  const hexToRgb = (hex) => {
    hex = hex.replace("#", "");
    if (hex.length === 3) {
      hex = hex.split("").map(ch => ch + ch).join("");
    }
    const bigint = parseInt(hex, 16);
    return [
      (bigint >> 16) & 255,
      (bigint >> 8) & 255,
      bigint & 255,
    ];
  };


  const { query } = useSearchStore();

  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) return toast.error("You must be logged in to view invoices");

      const invRes = await API.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const billRes = await API.get("/billing-profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvoices(invRes.data);
      setFilteredInvoices(invRes.data);
      if (billRes.data) setBillingProfile(billRes.data);

    } catch (err) {
      console.error("Fetch error:", err);
      toast.error("Failed to load invoices or billing profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);


  // FILTER
  useEffect(() => {
    let temp = invoices;

    if (filterStatus !== "all") temp = temp.filter(i => i.status === filterStatus);

    if (query.trim() !== "") {
      const q = query.toLowerCase();
      temp = temp.filter(inv =>
        inv.invoice_number.toLowerCase().includes(q) ||
        inv.client?.name?.toLowerCase().includes(q) ||
        String(inv.total).includes(q)
      );
    }

    setFilteredInvoices(temp);
  }, [filterStatus, invoices, query]);


  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Invoice deleted successfully");
      fetchInvoices();
    } catch {
      toast.error("Failed to delete invoice");
    }
  };

  const handleDownloadPDF = async (invoice) => {
  if (!billingProfile) {
    toast.error("Billing profile missing!");
    return;
  }

  const b = billingProfile;
  const cl = invoice.client || {};
  const currency = b.currency || "GBP";

  const BG    = [245, 242, 236]; // #F5F2EC cream
  const TEXT  = [26, 26, 26];
  const MUTED = [102, 102, 102];

  const fmt = (d) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("en-GB", {
      day: "2-digit", month: "short", year: "numeric"
    }).toLowerCase();
  };

  const doc = new jsPDF("p", "mm", "a4");
  const W = 210;
  const M = 20;   // left margin
  const R = W - M; // right edge

  // ── BACKGROUND ─────────────────────────────────────────
  doc.setFillColor(...BG);
  doc.rect(0, 0, 210, 297, "F");

  const t = (x, y, text, { size = 9, bold = false, color = TEXT, align = "left" } = {}) => {
    doc.setFillColor(...color);
    doc.setTextColor(...color);
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    if (align === "right")       doc.text(text, x, y, { align: "right" });
    else if (align === "center") doc.text(text, x, y, { align: "center" });
    else                         doc.text(text, x, y);
  };

  const hline = (y, x1 = M, x2 = R, lw = 0.3) => {
    doc.setDrawColor(...TEXT);
    doc.setLineWidth(lw);
    doc.line(x1, y, x2, y);
  };

  // ── HEADER ─────────────────────────────────────────────
  t(M, 18, "invoice", { size: 28, bold: true });

  const lx = W - 65;
  t(lx, 12, "invoice no:", { color: MUTED, align: "right" });
  t(lx, 19, "date:",        { color: MUTED, align: "right" });
  t(lx, 26, "due date:",    { color: MUTED, align: "right" });

  t(R, 12, `INV-${invoice.invoice_number}`, { align: "right" });
  t(R, 19, fmt(invoice.date),               { align: "right" });
  t(R, 26, fmt(invoice.due_date),           { align: "right" });

  // ── CUSTOMER ───────────────────────────────────────────
  const yc = 40;
  t(M, yc, "customer", { size: 10, bold: true });
  const cx = M + 22;
  t(cx, yc,      cl.name    || "Digital Growth Agency Ltd",               { size: 9 });
  t(cx, yc + 6,  cl.address || "14 King Street, Manchester, M2 6AG, UK",  { size: 9 });
  t(cx, yc + 12, cl.vat     || "GB987654321",                             { size: 9 });

  hline(yc + 17);

  // ── SUPPLIER ───────────────────────────────────────────
  const ys = yc + 26;
  t(M, ys, "supplier", { size: 10, bold: true });
  const sx = M + 22;
  [
    b.business_name || "BrightTech Solutions Ltd",
    b.phone         || "+44 20 7946 0958",
    b.address       || "221B Baker Street, London, NW1 6XE, UK",
    b.fiscal_code   || "GB123456789",
    b.email         || "contact@brighttech.co.uk",
  ].forEach((line, i) => t(sx, ys + i * 6, line, { size: 9 }));

  // ── TABLE ──────────────────────────────────────────────
  const yt = ys + 38;

  const cNo   = M + 2;
  const cDesc = M + 20;
  const cPri  = M + 82;
  const cQty  = M + 110;
  const cTot  = R;

  hline(yt - 6);

  t(cNo,   yt, "no",               { size: 8, color: MUTED });
  t(cDesc, yt, "item description", { size: 8, color: MUTED });
  t(cPri,  yt, "price",            { size: 8, color: MUTED });
  t(cQty,  yt, "quantity",         { size: 8, color: MUTED });
  t(cTot,  yt, "total",            { size: 8, color: MUTED, align: "right" });

  hline(yt + 4);

  const items = invoice.items || [];
  let rowY = yt + 13;
  items.forEach((item, idx) => {
    const no    = String(idx + 1).padStart(2, "0");
    const price = `${(item.unit_price ?? 0).toFixed(2)} ${currency}`;
    const qty   = String(item.quantity ?? 1);
    const total = `${(item.total ?? 0).toFixed(2)} ${currency}`;

    t(cNo,   rowY, no,               { size: 9 });
    t(cDesc, rowY, item.description, { size: 9 });
    t(cPri,  rowY, price,            { size: 9 });
    t(cQty,  rowY, qty,              { size: 9 });
    t(cTot,  rowY, total,            { size: 9, align: "right" });
    rowY += 13;
  });

  hline(rowY - 7);

  // Subtotal row
  t(cNo,  rowY, "subtotal (excl. vat)", { size: 9 });
  const subtotal = (invoice.subtotal ?? 0).toFixed(2);
  t(cTot, rowY, `${subtotal} ${currency}`, { size: 9, bold: true, align: "right" });

  // VAT / Discount / Total
  let sy = rowY + 12;
  t(cQty + 14, sy,     "vat (" + (b.vat_rate || 20) + "%)",    { size: 9, color: MUTED, align: "right" });
  t(cTot,      sy,     `${(invoice.tax_amount ?? 0).toFixed(2)} ${currency}`, { size: 9, align: "right" });

  t(cQty + 14, sy + 7, "discount (" + (b.discount_rate || 10) + "%)", { size: 9, color: MUTED, align: "right" });
  t(cTot,      sy + 7, `${(invoice.discount_amount ?? 0).toFixed(2)} ${currency}`, { size: 9, align: "right" });

  t(cQty + 14, sy + 16, "total (incl. VAT)", { size: 10, bold: true, align: "right" });
  t(cTot,      sy + 16, `${(invoice.total ?? 0).toFixed(2)} ${currency}`, { size: 10, bold: true, align: "right" });

  // ── FOOTER ─────────────────────────────────────────────
  const yf = 225;
  t(M, yf, "payment options", { size: 11, bold: true });

  [
    "Bank Transfer",
    b.business_name || "BrightTech Solutions Ltd",
    b.iban          || "GB29NWBK60161331926819",
    b.bank_name     || "Barclays",
  ].forEach((line, i) => t(M, yf + 8 + i * 5.5, line, { size: 9 }));

  // Right contact info
  t(R, yf + 10, `${b.email || "contact@brighttech.co.uk"}  ✉`,  { size: 8, align: "right" });
  t(R, yf + 18, `${b.address || "221B Baker Street, London"}  ⊞`, { size: 8, align: "right" });
  t(R, yf + 26, `${b.phone || "+44 20 7946 0958"}  ☎`,           { size: 8, align: "right" });

  doc.save(`invoice_${invoice.invoice_number}.pdf`);
};


  const handlePreview = (id) => navigate(`/dashboard/invoices/${id}`);

  return (
    <div className="relative p-8 text-white min-h-screen bg-[#0e0e0e]">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold flex items-center gap-2">
            <FileText className="text-[#80FFF9]" size={26} />
            Invoices
          </h1>
          <p className="text-gray-400 text-sm">Manage and track all invoices</p>
        </div>

        <button onClick={() => navigate("/dashboard/invoices/create")} className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition flex items-center gap-2" >
          <Plus size={18} />
          Create Invoice
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="flex flex-wrap items-center gap-4 mb-8 bg-[#1a1a1a]/70 border border-white/10 p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-[#80FFF9]" />
          <span className="text-gray-300">Filter by status:</span>
        </div>

        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="cursor-pointer bg-[#1a1a1a] border border-white/10 text-gray-200 px-4 py-2 rounded-md">
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
          <option value="overdue">Overdue</option>
        </select>

        <span className="text-gray-400 text-sm">
          Showing {filteredInvoices.length} of {invoices.length}
        </span>
      </div>

      {/* LIST */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-400 animate-pulse">Loading invoices...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/20 rounded-xl bg-[#1a1a1a]/60">
          <FileText className="w-16 h-16 text-white/20 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-300">No invoices</h3>
          <p className="text-sm text-gray-500">Try creating one!</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((inv) => (
            <div key={inv._id} className="bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-6 hover:border-[#80FFF9]/40 transition">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">{inv.invoice_number}</h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full capitalize ${
                    inv.status === "paid"
                      ? "bg-green-500/20 text-green-400"
                      : inv.status === "sent"
                      ? "bg-blue-500/20 text-blue-400"
                      : inv.status === "draft"
                      ? "bg-gray-500/20 text-gray-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {inv.status}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-1">
                {inv.client?.name || "Unknown Client"}
              </p>
              <p className="text-xs text-gray-500 mb-2">
                {inv.client?.email || "no-email@example.com"}
              </p>

              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-[#80FFF9] font-semibold">
                  {formatCurrency(inv.total, billingProfile?.currency)}
                </p>
              </div>

              {/* card buttons */}
              <div className="flex justify-between mt-4">
                
                <button onClick={()=> handlePreview(inv._id)} className="p-2 text-gray-400 hover:text-[#80FFF9] transition" title="View">
                  <Eye size={18} />
                </button>
                
                <button onClick={() => navigate(`/dashboard/invoices/${inv._id}/edit`) } className="p-2 text-gray-400 hover:text-indigo-400 transition" >
                  <Edit size={18} />
                </button>

                <button onClick={() => handleDownloadPDF(inv)} className="p-2 text-gray-400 hover:text-green-400 transition" >
                  <Download size={18} />
                </button>

                <button onClick={() => handleDelete(inv._id)} className="p-2 text-gray-400 hover:text-red-400 transition" >
                  <Trash2 size={18} />
                </button>
              
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
