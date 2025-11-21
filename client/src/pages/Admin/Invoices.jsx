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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  search global din navbar
  const { query } = useSearchStore();

  // FETCH INVOICES
  const fetchInvoices = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must be logged in to view invoices");
        return;
      }

      const { data } = await API.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInvoices(data);
      setFilteredInvoices(data);
    } catch (err) {
      console.error("❌ Fetch invoices error:", err);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // FILTER BY STATUS
  useEffect(() => {
    let temp = invoices;

    if (filterStatus !== "all") {
      temp = temp.filter((i) => i.status === filterStatus);
    }

    // aplică search la final peste filtrul de status
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

  // DELETE INVOICE
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

  // DOWNLOAD PDF
  const handleDownloadPDF = async (invoice) => {
    const doc = new jsPDF("p", "mm", "a4");
    const accent = [58, 110, 165];
    const gray = [60, 60, 60];
    const link = `${window.location.origin}/dashboard/invoices/${invoice._id}`;

    const logoUrl = "https://cdn-icons-png.flaticon.com/512/9429/9429026.png";
    doc.addImage(logoUrl, "PNG", 15, 10, 18, 18);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("BillForge AI", 36, 17);

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Smart Invoice Generator", 36, 23);

    const qr = await QRCode.toDataURL(link);
    doc.addImage(qr, "PNG", 170, 10, 25, 25);

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

    // client details
    let rightY = 50;
    const client = invoice.client || {};

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accent);
    doc.text("Bill To:", 120, rightY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    rightY += 6;

    doc.text(client.name || "Unknown Client", 120, rightY);
    if (client.company) {
      rightY += 5;
      doc.text(client.company, 120, rightY);
    }
    if (client.email) {
      rightY += 5;
      doc.text(client.email, 120, rightY);
    }
    if (client.phone) {
      rightY += 5;
      doc.text(client.phone, 120, rightY);
    }
    if (client.address) {
      rightY += 5;
      doc.text(client.address, 120, rightY);
    }

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

    // items
    const items =
      invoice.items?.map((item) => [
        item.description,
        item.quantity,
        `$${item.unit_price}`,
        `$${item.total}`,
      ]) || [];

    autoTable(doc, {
      startY: infoY + 35,
      head: [["Description", "Qty", "Unit Price", "Total"]],
      body: items,
      theme: "grid",
      headStyles: {
        fillColor: accent,
        textColor: [255, 255, 255],
      },
      styles: {
        fontSize: 10,
      },
      margin: { left: 15, right: 15 },
    });

    const finalY = doc.lastAutoTable.finalY;

    // totals
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("Summary", 140, finalY + 10);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);

    doc.text("Subtotal:", 140, finalY + 18);
    doc.text(`$${invoice.subtotal}`, 175, finalY + 18);

    doc.text("Tax:", 140, finalY + 24);
    doc.text(`${invoice.tax_rate}%`, 175, finalY + 24);

    doc.text("Discount:", 140, finalY + 30);
    doc.text(`${invoice.discount_rate}%`, 175, finalY + 30);

    doc.setFont("helvetica", "bold");
    doc.text("Total:", 140, finalY + 40);
    doc.text(`$${invoice.total}`, 175, finalY + 40);

    // signature
    const signY = finalY + 90;
    doc.line(25, signY, 85, signY);
    doc.line(125, signY, 185, signY);

    doc.text("Client Signature", 35, signY + 6);
    doc.text("Authorized Signature", 135, signY + 6);

    // footer
    doc.setFontSize(9);
    doc.text("Generated by BillForge AI • www.billforge.app", 15, 290);

    doc.save(`invoice_${invoice.invoice_number}.pdf`);
  };

  const handlePreview = (invoiceId) => {
    navigate(`/dashboard/invoices/${invoiceId}`)
  }

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
                  ${Number(inv.total || 0).toFixed(2)}
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
