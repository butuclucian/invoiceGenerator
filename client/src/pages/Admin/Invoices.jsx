import React, { useEffect, useRef, useState } from "react";
import { FileText, Edit, Trash2, Download, Filter, Plus, Eye, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import html2pdf from "html2pdf.js";
import { useSearchStore } from "../../store/useSearchStore";

import Template1 from "../../components/invoiceTemplates/Template1";
import Template2 from "../../components/invoiceTemplates/Template2";
import Template3 from "../../components/invoiceTemplates/Template3";

// ─── Componenta de preview — randează template-ul ca HTML vizibil ───────────────
const InvoicePreview = ({ invoice, template, billingProfile }) => {
  if (!invoice || !billingProfile) return null;

  const props = { invoice, billingProfile };

  // Scalăm template-ul (794px lățime) la ~280px pentru preview în modal
  const scale = 280 / 794;

  return (
    <div style={{
      width: "280px",
      height: `${Math.round(1123 * scale)}px`,
      overflow: "hidden",
      position: "relative",
      borderRadius: "6px",
      border: "1px solid rgba(255,255,255,0.1)",
      backgroundColor: "#F5F2EC",
    }}>
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        width: "794px",
        pointerEvents: "none",
      }}>
        {template === 1 && <Template1 {...props} />}
        {template === 2 && <Template2 {...props} />}
        {template === 3 && <Template3 {...props} />}
      </div>
    </div>
  );
};
// ─────────────────────────────────────────────────────────────────────────────────

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [billingProfile, setBillingProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);

  // Ref către hidden div-ul folosit pentru generarea PDF-ului
  const hiddenRef = useRef(null);

  const { query } = useSearchStore();

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

    if (filterStatus !== "all") temp = temp.filter((i) => i.status === filterStatus);

    if (query.trim() !== "") {
      const q = query.toLowerCase();
      temp = temp.filter(
        (inv) =>
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

  // ── Download PDF — apelat DOAR la click pe butonul Download ─────────────────
  const handleDownloadPDF = () => {
    const element = hiddenRef.current;
    if (!element) {
      toast.error("Preview not ready, please try again.");
      return;
    }

    setIsDownloading(true);

    const opt = {
      margin: 0,
      filename: `invoice_${selectedInvoice.invoice_number}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(element)
      .save()
      .then(() => {
        setIsDownloading(false);
        setShowTemplateModal(false);
        setSelectedInvoice(null);
      })
      .catch(() => {
        setIsDownloading(false);
        toast.error("Failed to generate PDF");
      });
  };

  const handleOpenModal = (inv) => {
    setSelectedInvoice(inv);
    setSelectedTemplate(1);
    setShowTemplateModal(true);
  };

  const handleCloseModal = () => {
    setShowTemplateModal(false);
    setSelectedInvoice(null);
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

        <button
          onClick={() => navigate("/dashboard/invoices/create")}
          className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition flex items-center gap-2"
        >
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

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="cursor-pointer bg-[#1a1a1a] border border-white/10 text-gray-200 px-4 py-2 rounded-md"
        >
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
            <div
              key={inv._id}
              className="bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-6 hover:border-[#80FFF9]/40 transition"
            >
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

              <p className="text-sm text-gray-400 mb-1">{inv.client?.name || "Unknown Client"}</p>
              <p className="text-xs text-gray-500 mb-2">{inv.client?.email || "no-email@example.com"}</p>

              <div className="border-t border-white/10 pt-3 flex items-center justify-between">
                <p className="text-gray-400 text-sm">Total</p>
                <p className="text-[#80FFF9] font-semibold">
                  {formatCurrency(inv.total, billingProfile?.currency)}
                </p>
              </div>

              {/* Card buttons */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handlePreview(inv._id)}
                  className="p-2 text-gray-400 hover:text-[#80FFF9] transition"
                  title="View"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => navigate(`/dashboard/invoices/${inv._id}/edit`)}
                  className="p-2 text-gray-400 hover:text-indigo-400 transition"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleOpenModal(inv)}
                  className="p-2 text-gray-400 hover:text-green-400 transition"
                  title="Download"
                >
                  <Download size={18} />
                </button>
                <button
                  onClick={() => handleDelete(inv._id)}
                  className="p-2 text-gray-400 hover:text-red-400 transition"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TEMPLATE MODAL ──────────────────────────────────────────────────────── */}
      {showTemplateModal && selectedInvoice && billingProfile && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
        >
          <div className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div>
                <h2 className="text-xl font-semibold">Choose Template</h2>
                <p className="text-gray-400 text-sm mt-1">
                  Selectează un template, apoi apasă Download PDF.
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-2 text-gray-400 hover:text-white transition rounded-lg hover:bg-white/10"
              >
                <X size={20} />
              </button>
            </div>

            {/* Template previews */}
            <div className="p-6 flex gap-6 justify-center flex-wrap">
              {[1, 2, 3].map((tpl) => (
                <div
                  key={tpl}
                  onClick={() => setSelectedTemplate(tpl)}
                  className="flex flex-col items-center gap-3 cursor-pointer"
                >
                  <div
                    className={`rounded-xl transition-all duration-200 ${
                      selectedTemplate === tpl
                        ? "ring-2 ring-[#80FFF9] ring-offset-2 ring-offset-[#141414]"
                        : "opacity-60 hover:opacity-90"
                    }`}
                  >
                    <InvoicePreview
                      invoice={selectedInvoice}
                      template={tpl}
                      billingProfile={billingProfile}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full border-2 transition-colors ${
                        selectedTemplate === tpl
                          ? "border-[#80FFF9] bg-[#80FFF9]"
                          : "border-gray-500"
                      }`}
                    />
                    <span
                      className={`text-sm transition-colors ${
                        selectedTemplate === tpl ? "text-[#80FFF9]" : "text-gray-400"
                      }`}
                    >
                      Template {tpl}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-white/10">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-5 py-2.5 rounded-xl bg-indigo-600/30 border border-indigo-600/50 hover:bg-indigo-600/40 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download size={16} />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── HIDDEN DIV pentru generarea PDF — în afara viewport-ului ──────────── */}
      {selectedInvoice && billingProfile && (
        <div
          style={{
            position: "fixed",
            top: "-9999px",
            left: "-9999px",
            pointerEvents: "none",
            zIndex: -1,
          }}
        >
          <div ref={hiddenRef}>
            {selectedTemplate === 1 && (
              <Template1 invoice={selectedInvoice} billingProfile={billingProfile} />
            )}
            {selectedTemplate === 2 && (
              <Template2 invoice={selectedInvoice} billingProfile={billingProfile} />
            )}
            {selectedTemplate === 3 && (
              <Template3 invoice={selectedInvoice} billingProfile={billingProfile} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Invoices;