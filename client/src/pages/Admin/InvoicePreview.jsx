import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Edit, FileText } from "lucide-react";
import { toast } from "sonner";
import html2pdf from "html2pdf.js";
import API from "../../utils/api";

import Template1 from "../../components/invoiceTemplates/Template1";
import Template2 from "../../components/invoiceTemplates/Template2";
import Template3 from "../../components/invoiceTemplates/Template3";

const preInvoicePreview = ({ invoice, template, billingProfile }) => {
  if (!invoice || !billingProfile) return null;

  const props = { invoice, billingProfile };
  const scale = 280 / 794;

  return (
    <div style={{width: "280px", height: `${Math.round(1123 * scale)}px`, overflow: "hidden", position: "relative", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)", backgroundColor: "#F5F2EC",}}>
      <div style={{transform: `scale(${scale})`, transformOrigin: "top left", width: "794px", pointerEvents: "none",}}>
        {template === 1 && <Template1 {...props} />}
        {template === 2 && <Template2 {...props} />}
        {template === 3 && <Template3 {...props} />}
      </div>
    </div>
  );
};

const InvoicePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await API.get(`/invoices/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setInvoice(data);
        setClient(data.client);
      } catch (err) {
        toast.error("Invoice not found");
        navigate("/dashboard/invoices");
      }
    };

    fetchInvoice();
  }, [id]);

  if (!invoice)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading invoice...
      </div>
    );

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

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB").replace(/\//g, "-");

  };

  const discountAmount = invoice.discount_rate
  ? (invoice.subtotal * invoice.discount_rate) / 100
  : 0;

const taxAmount = invoice.tax_rate
  ? ((invoice.subtotal - discountAmount) * invoice.tax_rate) / 100
  : 0;



  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-10 overflow-hidden pb-16 p-8 pt-30 space-y-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-2 text-center md:text-left">
          <FileText className="text-[#80FFF9]" size={26} />
          <h1 className="text-2xl sm:text-3xl font-semibold">Invoice Preview</h1>
        </div>
      </div>

      {/* INVOICE CARD */}
      <div className="max-w-4xl mx-auto bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-6 sm:p-10 shadow-lg shadow-indigo-500/10">

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-8">

          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-[#80FFF9]">
              {invoice.invoice_number}
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Date: {formatDate(invoice.date)}
              <br />
              Due Date: {formatDate(invoice.due_date)}
            </p>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-gray-400 text-sm">Status:</p>
            <span
              className={`text-sm px-3 py-1 rounded-full capitalize ${
                invoice.status === "paid"
                  ? "bg-green-500/20 text-green-400"
                  : invoice.status === "sent"
                  ? "bg-blue-500/20 text-blue-400"
                  : invoice.status === "draft"
                  ? "bg-gray-500/20 text-gray-400"
                  : "bg-red-500/20 text-red-400"
              }`}
            >
              {invoice.status}
            </span>
          </div>
        </div>

        {/* Client Info */}
        <div className="mb-10 border-b border-white/10 pb-6">
          <h3 className="text-lg font-semibold">Billed To:</h3>
          <div className="mt-2 space-y-1">
            <p className="text-gray-300">{client?.name}</p>
            <p className="text-gray-400 text-sm">{client?.email}</p>
            <p className="text-gray-400 text-sm">{client?.company}</p>
            <p className="text-gray-400 text-sm">{client?.address}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-left">

            <thead>
              <tr className="text-gray-300 border-b border-white/10 text-sm">
                <th className="pb-3">Description</th>
                <th className="pb-3 text-right">Qty</th>
                <th className="pb-3 text-right">Unit Price</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>

            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={index} className="border-b border-white/5 text-gray-400 hover:bg-white/5 transition">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">${item.unit_price.toFixed(2)}</td>
                  <td className="py-2 text-right text-white font-medium">
                    ${item.total.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* Totals */}
        <div className="border-t border-white/10 pt-6 text-gray-300 text-sm space-y-2">

          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${(invoice.subtotal ?? 0).toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-red-400">
  <span>Discount ({invoice.discount_rate || 0}%):</span>
  <span>
    -${discountAmount.toFixed(2)}
  </span>
</div>

<div className="flex justify-between text-[#80FFF9]">
  <span>Tax ({invoice.tax_rate || 0}%):</span>
  <span>
    +${taxAmount.toFixed(2)}
  </span>
</div>


          <div className="flex justify-between font-semibold text-[#80FFF9] text-lg mt-2 border-t border-white/10 pt-2">
            <span>Total:</span>
            <span>${(invoice.total ?? 0).toFixed(2)}</span>
          </div>
        </div>


        {/* Notes */}
        {invoice.notes && (
          <div className="mt-10 border-t border-white/10 pt-6">
            <h4 className="text-gray-300 font-medium mb-2">Notes:</h4>
            <p className="text-gray-400 text-sm whitespace-pre-line">
              {invoice.notes}
            </p>
          </div>
        )}

      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-[#111111]/90 border-t border-white/10 backdrop-blur-md py-4 z-40">
        <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 px-4">

          {/* Edit */}
          <button
            type="button"
            onClick={() => navigate(`/dashboard/invoices/${invoice._id}/edit`)}
            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 border border-white/20 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/10 transition duration-300"
          >
            <Edit size={16} />
            Edit
          </button>

          {/* Download */}
          <button type="button" onClick={handleDownloadPDF} className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-600/20 hover:from-teal-500/30 hover:to-indigo-600/30 border border-teal-500/30 hover:border-teal-400/60 text-xs font-mono uppercase tracking-wider text-[#80FFF9] font-bold shadow-lg transition duration-300">
            <Download size={16} />
            Download
          </button>

        </div>
      </div>


    </div>
  );
};

export default InvoicePreview;
