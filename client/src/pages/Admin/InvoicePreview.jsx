import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Download, Edit, FileText } from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../../utils/api";

const InvoicePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [client, setClient] = useState(null);

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

  // PDF Download
  const handleDownload = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text(`Invoice: ${invoice.invoice_number}`, 14, 20);

    doc.setFontSize(12);
    doc.text("Billed To:", 14, 35);
    doc.text(client?.name || "Unknown Client", 14, 42);
    if (client?.company) doc.text(client.company, 14, 49);
    if (client?.email) doc.text(client.email, 14, 56);
    if (client?.address) doc.text(client.address, 14, 63);

    doc.text(`Date: ${invoice.date}`, 150, 35);
    doc.text(`Due Date: ${invoice.due_date || "N/A"}`, 150, 42);
    doc.text(`Status: ${invoice.status}`, 150, 49);

    const tableData = invoice.items.map((item) => [
      item.description,
      item.quantity,
      `$${item.unit_price.toFixed(2)}`,
      `$${item.total.toFixed(2)}`,
    ]);

    autoTable(doc, {
      startY: 75,
      head: [["Description", "Qty", "Unit Price", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [240, 240, 240], textColor: 0 },
      styles: { fontSize: 11, textColor: 50 },
    });

    let finalY = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: $${invoice.subtotal.toFixed(2)}`, 150, finalY);

    if (invoice.discount_amount > 0) {
      finalY += 7;
      doc.text(
        `Discount (${invoice.discount_rate}%): -$${invoice.discount_amount.toFixed(
          2
        )}`,
        150,
        finalY
      );
    }

    if (invoice.tax_amount > 0) {
      finalY += 7;
      doc.text(
        `Tax (${invoice.tax_rate}%): +$${invoice.tax_amount.toFixed(2)}`,
        150,
        finalY
      );
    }

    finalY += 10;
    doc.text(`Total: $${invoice.total.toFixed(2)}`, 150, finalY);

    if (invoice.notes) {
      doc.text("Notes:", 14, finalY + 15);
      const notes = doc.splitTextToSize(invoice.notes, 180);
      doc.text(notes, 14, finalY + 22);
    }

    doc.save(`${invoice.invoice_number}.pdf`);
    toast.success("Invoice downloaded!");
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-6 md:px-10 py-8">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between justify-center items-center gap-4 mb-10">

        {/* Title */}
        <div className="flex items-center gap-2 text-center md:text-left">
          <FileText className="text-[#80FFF9]" size={26} />
          <h1 className="text-2xl sm:text-3xl font-semibold">Invoice Preview</h1>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center w-full md:w-auto md:justify-end">

          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg
            text-gray-300 hover:text-white hover:bg-white/10 transition text-sm sm:text-base" >
            <ArrowLeft size={16} />
            Back
          </button>

          <button onClick={() => navigate(`/dashboard/invoices/${invoice._id}/edit`)} className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-lg
            text-indigo-400 hover:text-white hover:bg-indigo-500/10 transition text-sm sm:text-base" >
            <Edit size={16} />
            Edit
          </button>

          <button onClick={handleDownload} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600/20
            border border-indigo-600/40 hover:bg-indigo-600/30 transition text-sm sm:text-base" >
            <Download size={16} />
            Download
          </button>

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
              Date: {invoice.date}
              <br />
              Due: {invoice.due_date || "N/A"}
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
            <span>${invoice.subtotal.toFixed(2)}</span>
          </div>

          {invoice.discount_amount > 0 && (
            <div className="flex justify-between text-red-400">
              <span>Discount ({invoice.discount_rate}%):</span>
              <span>- ${invoice.discount_amount.toFixed(2)}</span>
            </div>
          )}

          {invoice.tax_amount > 0 && (
            <div className="flex justify-between text-[#80FFF9]">
              <span>Tax ({invoice.tax_rate}%):</span>
              <span>+ ${invoice.tax_amount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between font-semibold text-[#80FFF9] text-lg mt-2 border-t border-white/10 pt-2">
            <span>Total:</span>
            <span>${invoice.total.toFixed(2)}</span>
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

    </div>
  );
};

export default InvoicePreview;
