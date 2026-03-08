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
    const c = invoice.client || {};
    const currency = b.currency || "EUR";
    const accent = hexToRgb("#0f6c91");
    const gray = [50, 50, 50];

    const formatDate = (d) => {
      if (!d) return "-";
      const date = new Date(d);
      return date.toLocaleDateString("en-GB").replaceAll("/", "-");
    };

    const doc = new jsPDF("p", "mm", "a4");
    let y = 15;

    // QR Code - new website
    const qrImg = await QRCode.toDataURL("https://invoice-generator-ungi.vercel.app/");
    doc.addImage(qrImg, "PNG", 165, 10, 35, 35);

    // logo
    if (b.logo) {
      doc.addImage(b.logo, "PNG", 15, y, 26, 26);
    }

    // Company Header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(...accent);
    doc.text(b.business_name || "Company Name", 50, y + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...gray);

    if (b.address) doc.text(b.address, 50, y + 16);
    if (b.email) doc.text(b.email, 50, y + 21);
    if (b.phone) doc.text(b.phone, 50, y + 26);
    if (b.fiscal_code) doc.text(`CIF: ${b.fiscal_code}`, 50, y + 31);
    if (b.iban) doc.text(`IBAN: ${b.iban}`, 50, y + 36);

    y += 48;
    doc.setDrawColor(...accent);
    doc.line(15, y, 195, y);
    y += 10;

    // Bill To
    doc.setFont("helvetica", "bold").setTextColor(...accent);
    doc.text("Bill To", 15, y);
    y += 6;

    doc.setFont("helvetica", "normal").setTextColor(...gray);
    doc.text(c.name || "Unknown Client", 15, y);

    let lineY = y;

    if (c.email) doc.text(c.email, 15, (lineY += 5));
    if (c.address) doc.text(c.address, 15, (lineY += 5));
    if (c.phone) doc.text(c.phone, 15, (lineY += 5));

    // Invoice Details
    const infoY = 68;
    doc.setFont("helvetica", "bold").setTextColor(...accent);
    doc.text("Invoice Details", 120, infoY);

    doc.setFont("helvetica", "normal").setTextColor(...gray);
    doc.text(`Invoice : #${invoice.invoice_number}`, 120, infoY + 6);
    doc.text(`Date: ${formatDate(invoice.date)}`, 120, infoY + 12);
    doc.text(`Due: ${formatDate(invoice.due_date)}`, 120, infoY + 18);
    doc.text(`Status: ${invoice.status}`, 120, infoY + 24);

    // Items Table
    const formattedItems = invoice.items?.map(i => [
      i.description,
      i.quantity,
      `${(i.unit_price ?? 0).toFixed(2)} ${currency}`,
      `${(i.total ?? 0).toFixed(2)} ${currency}`
    ]) || [];

    autoTable(doc, {
      startY: infoY + 35,
      head: [["Description", "Qty", "Unit Price", "Total"]],
      body: formattedItems,
      theme: "grid",
      headStyles: {
        fillColor: accent,
        textColor: [255, 255, 255],
        fontStyle: "bold"
      },
      styles: { fontSize: 10, textColor: [20, 20, 20], fillStyle: "solid" },
      margin: { left: 15, right: 15 }
    });

    const finalY = doc.lastAutoTable.finalY + 12;

    // Summary Section
    doc.setFont("helvetica", "bold").setTextColor(...accent);
    doc.text("Summary", 140, finalY);

    doc.setFont("helvetica", "normal").setTextColor(...gray);
    doc.text(`VAT (${b.vat_rate}%):`, 120, finalY + 8);
    doc.text(`${(invoice.tax_amount ?? 0).toFixed(2)} ${currency}`, 185, finalY + 8, { align: "right" });

    doc.text(`Discount:`, 120, finalY + 14);
    doc.text(`${(invoice.discount_amount ?? 0).toFixed(2)} ${currency}`, 185, finalY + 14, { align: "right" });

    doc.setFont("helvetica", "bold").setTextColor(...accent);
    doc.setFontSize(12);
    doc.text(`Total:`, 120, finalY + 26);
    doc.text(`${(invoice.total ?? 0).toFixed(2)} ${currency}`, 185, finalY + 26, { align: "right" });

    // Footer - Signatures
    doc.setFontSize(9).setTextColor(120, 120, 120);

    // Authorized Signature (left)
    doc.line(25, 275, 85, 275);
    doc.text("Authorized Signature", 35, 280);

    // Client Signature (right)
    doc.line(125, 275, 185, 275);
    doc.text("Client Signature", 145, 280);

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
