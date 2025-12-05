import React, { useEffect, useState } from "react";
import { FileText, Edit, Trash2, Download, Plus, Eye } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";
import { useSearchStore } from "../../store/useSearchStore";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [billingProfile, setBillingProfile] = useState(null);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { query } = useSearchStore();

  const fetchData = async () => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const [invRes, billRes] = await Promise.all([
        API.get("/invoices", { headers: { Authorization: `Bearer ${token}` } }),
        API.get("/billing-profile", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setInvoices(invRes.data || []);
      setFilteredInvoices(invRes.data || []);
      setBillingProfile(billRes.data || null);

    } catch (err) {
      toast.error("Failed to load invoices or billing data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filter and search
  useEffect(() => {
    let temp = invoices;

    if (filterStatus !== "all") {
      temp = temp.filter((i) => i.status === filterStatus);
    }

    if (query.trim() !== "") {
      const q = query.toLowerCase();
      temp = temp.filter(
        (i) =>
          i.invoice_number?.toLowerCase().includes(q) ||
          i.client?.name?.toLowerCase().includes(q)
      );
    }

    setFilteredInvoices(temp);
  }, [filterStatus, query, invoices]);

  // PDF generation
  const handleDownloadPDF = async (invoice) => {
    const b = billingProfile || {};
    const c = invoice.client || {};
    const currency = b.currency || "RON";

    const doc = new jsPDF("p", "mm", "a4");

    // LOGO only if exists
    if (b.logo) {
      try {
        doc.addImage(b.logo, "PNG", 15, 10, 25, 25);
      } catch (err) {
        console.warn("Logo is invalid or blocked by CORS");
      }
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(b.business_name || "Company Name", 45, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    if (b.address) doc.text(b.address, 45, 26);
    if (b.email) doc.text(`Email: ${b.email}`, 45, 30);
    if (b.phone) doc.text(`Phone: ${b.phone}`, 45, 34);
    if (b.fiscal_code) doc.text(`CIF: ${b.fiscal_code}`, 45, 38);
    if (b.iban) doc.text(`IBAN: ${b.iban}`, 45, 42);
    if (b.bank) doc.text(`Bank: ${b.bank}`, 45, 46);

    const qrURL = `${window.location.origin}/dashboard/invoices/${invoice._id}`;
    const qr = await QRCode.toDataURL(qrURL);
    doc.addImage(qr, "PNG", 165, 10, 30, 30);

    let y = 60;

    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 15, y);

    y += 6;
    doc.setFont("helvetica", "normal");
    doc.text(c.name || "Unnamed Client", 15, y);
    if (c.email) doc.text(c.email, 15, y + 5);
    if (c.address) doc.text(c.address, 15, y + 10);

    doc.setFont("helvetica", "bold");
    doc.text("Invoice Details:", 120, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Invoice #${invoice.invoice_number}`, 120, 66);
    doc.text(`Date: ${invoice.date || "-"}`, 120, 72);
    doc.text(`Due: ${invoice.due_date || "-"}`, 120, 78);
    doc.text(`Status: ${invoice.status}`, 120, 84);

    const items =
      invoice.items?.map((i) => [
        i.description,
        i.quantity,
        `${currency} ${Number(i.unit_price).toFixed(2)}`,
        `${currency} ${Number(i.total).toFixed(2)}`,
      ]) || [];

    autoTable(doc, {
      startY: 100,
      head: [["Description", "Qty", "Price", "Total"]],
      body: items,
      theme: "striped",
      margin: { left: 15, right: 15 },
    });

    const fy = doc.lastAutoTable.finalY + 10;

    doc.setFont("helvetica", "bold");
    doc.text("Summary", 140, fy);

    doc.setFont("helvetica", "normal");
    doc.text(`Subtotal: ${currency} ${Number(invoice.subtotal).toFixed(2)}`, 140, fy + 7);
    doc.text(
      `VAT (${b.vat_rate || 0}%): ${currency} ${Number(invoice.tax_amount).toFixed(2)}`,
      140,
      fy + 14
    );
    doc.text(
      `Discount: ${currency} ${Number(invoice.discount_amount).toFixed(2)}`,
      140,
      fy + 21
    );

    doc.setFont("helvetica", "bold");
    doc.text(
      `Total: ${currency} ${Number(invoice.total).toFixed(2)}`,
      140,
      fy + 32
    );

    doc.save(`invoice_${invoice.invoice_number}.pdf`);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Invoice deleted");
      fetchData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="relative p-8 min-h-screen bg-[#0e0e0e] text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl flex items-center gap-2">
          <FileText className="text-[#80FFF9]" /> Invoices
        </h1>

        <button
          onClick={() => navigate("/dashboard/invoices/create")}
          className="px-4 py-2 flex gap-2 items-center rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30"
        >
          <Plus size={18} /> Create Invoice
        </button>
      </div>

      {!billingProfile && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-md text-red-300 text-sm">
          ⚠ You must configure your Billing Profile before sending invoices!
        </div>
      )}

      {!loading && filteredInvoices.length === 0 ? (
        <p className="text-center opacity-70">No invoices found</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInvoices.map((inv) => (
            <div
              key={inv._id}
              className="bg-[#1a1a1a]/80 border border-white/10 p-6 rounded-xl"
            >
              <div className="flex justify-between">
                <span className="font-semibold">{inv.invoice_number}</span>
                <span className="text-xs capitalize opacity-60">
                  {inv.status}
                </span>
              </div>

              <p className="text-sm opacity-70 mt-1">{inv.client?.name}</p>

              <div className="flex justify-between items-center mt-3 border-t pt-3 border-white/10">
                <span>Total</span>
                <span className="text-[#80FFF9] font-medium">
                  {billingProfile?.currency || "RON"}{" "}
                  {Number(inv.total).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button onClick={() => navigate(`/dashboard/invoices/${inv._id}`)}>
                  <Eye size={18} />
                </button>
                <button onClick={() => navigate(`/dashboard/invoices/${inv._id}/edit`)}>
                  <Edit size={18} />
                </button>
                <button onClick={() => handleDownloadPDF(inv)}>
                  <Download size={18} />
                </button>
                <button onClick={() => handleDelete(inv._id)}>
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
