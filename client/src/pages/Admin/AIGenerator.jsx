import React, { useState, useRef } from "react";
import {
  Brain,
  Loader2,
  FileText,
  RotateCcw,
  Save,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import API from "../../utils/api";
import logo from "../../assets/react.svg";

const AIGenerator = () => {
  const [text, setText] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef();

  // 🔹 Trimite textul la backend (Gemini)
  const handleExtract = async () => {
    if (!text.trim()) {
      toast.error("Please paste the invoice text first!");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await API.post(
        "/ai/generate-invoice",
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data?.success) {
        setInvoice(data.invoice);
        toast.success("AI successfully generated invoice!");
      } else {
        toast.error("AI did not return valid data");
      }
    } catch (err) {
      console.error("AI generation error:", err);
      toast.error(err.response?.data?.message || "AI request failed");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText("");
    setInvoice(null);
    toast.info("Reset successfully");
  };

  const handleDownloadPDF = async () => {
    if (!invoice) return toast.error("No invoice to export!");

    try {
      const doc = new jsPDF("p", "mm", "a4");
      const img = new Image();
      img.src = logo;
      await new Promise((res) => (img.onload = res));
      doc.addImage(img, "PNG", 14, 10, 25, 25);

      doc.setFontSize(20);
      doc.text("Invoice", 170, 25, { align: "right" });
      doc.setFontSize(11);
      doc.text(`Invoice #: ${invoice.invoice_number}`, 170, 32, { align: "right" });
      doc.text(`Date: ${invoice.date}`, 170, 38, { align: "right" });

      const { default: autoTable } = await import("jspdf-autotable");
      const tableData = invoice.items.map((i) => [
        i.description,
        i.quantity,
        `$${i.unit_price}`,
        `$${i.total}`,
      ]);

      autoTable(doc, {
        startY: 60,
        head: [["Description", "Qty", "Unit", "Total"]],
        body: tableData,
        theme: "grid",
      });

      let y = doc.lastAutoTable.finalY + 10;
      doc.text(`Subtotal: $${invoice.subtotal}`, 150, y);
      y += 6;
      doc.text(`Total: $${invoice.total}`, 150, y);

      doc.save(`${invoice.invoice_number}.pdf`);
      toast.success("PDF downloaded!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF");
    }
  };

  // ✅ UI simplificat
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-10 py-10">
      {/* ===== HEADER ===== */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <Brain className="text-[#80FFF9]" size={26} />
            AI Invoice Generator
          </h1>
          <p className="text-gray-400 text-sm">
            Paste text below and let AI generate your invoice.
          </p>
        </div>
      </div>

      {/* ===== INPUT SECTION ===== */}
      <div className="max-w-5xl mx-auto mb-10">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste client text or email content here..."
          className="w-full h-56 bg-[#1a1a1a]/80 border border-white/10 rounded-xl p-4 text-gray-200 placeholder-gray-500 focus:border-[#80FFF9] outline-none transition resize-none"
        />

        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={handleReset}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 border border-white/20 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition disabled:opacity-50"
          >
            <RotateCcw size={16} />
            Reset
          </button>

          <button
            onClick={handleExtract}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={16} />
                Thinking...
              </>
            ) : (
              <>
                <FileText size={16} />
                Generate with AI
              </>
            )}
          </button>
        </div>
      </div>

      {/* ===== RESULT ===== */}
      {loading ? (
        <div className="flex flex-col items-center justify-center mt-20">
          <div className="relative flex items-center justify-center w-32 h-32">
            <div className="absolute w-full h-full rounded-full bg-gradient-to-r from-[#80FFF9] to-purple-500 opacity-30 animate-ping" />
            <div className="absolute w-20 h-20 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 blur-md animate-pulse" />
            <Brain className="text-[#80FFF9] animate-bounce" size={48} />
          </div>
          <p className="text-gray-400 mt-6 animate-pulse">
            AI is analyzing your text...
          </p>
        </div>
      ) : (
        invoice && (
          <div
            ref={pdfRef}
            className="max-w-5xl mx-auto bg-[#1a1a1a] border border-white/10 rounded-xl p-8 mt-10 shadow-lg shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h2 className="text-2xl font-semibold text-[#80FFF9]">
                {invoice.invoice_number}
              </h2>
              <span className="text-gray-400 text-sm capitalize">
                {invoice.status}
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-gray-400 text-sm">Client</p>
                <p className="font-medium text-white">{invoice.client?.name}</p>
                <p className="text-sm text-gray-400">{invoice.client?.email}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-sm">Date</p>
                <p>{invoice.date}</p>
                <p className="text-gray-400 text-sm">
                  Due: {invoice.due_date || "N/A"}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border-t border-white/10 pt-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-gray-400 border-b border-white/10">
                    <th className="text-left py-2">Description</th>
                    <th className="text-center py-2">Qty</th>
                    <th className="text-center py-2">Unit</th>
                    <th className="text-right py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className="py-2">{item.description}</td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center">${item.unit_price}</td>
                      <td className="text-right text-[#80FFF9]">${item.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-right mt-4 border-t border-white/10 pt-3">
              <p className="text-gray-300">Subtotal: ${invoice.subtotal}</p>
              <p className="text-lg font-semibold text-[#80FFF9]">
                Total: ${invoice.total}
              </p>
            </div>

            {invoice.notes && (
              <div className="mt-4 border-t border-white/10 pt-3">
                <p className="text-sm text-gray-400">Notes:</p>
                <p>{invoice.notes}</p>
              </div>
            )}

            <div className="flex justify-center gap-4 mt-8">
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-5 py-2 border border-white/20 text-gray-300 hover:text-[#80FFF9] hover:bg-white/10 rounded-md transition"
              >
                <Download size={16} /> Download PDF
              </button>

              <button
                onClick={() => toast.success("Invoice saved successfully!")}
                className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition"
              >
                <Save size={16} /> Save
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AIGenerator;
