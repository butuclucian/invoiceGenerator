import React, { useState, useRef, useEffect } from "react";
import {
  Brain,
  Loader2,
  FileText,
  RotateCcw,
  Save,
  Download,
  Lock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { jsPDF } from "jspdf";
import API from "../../utils/api";
import logo from "../../assets/invoicelogo.png";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";


const AIGenerator = () => {
  const [text, setText] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(false);
  const pdfRef = useRef();

  const [plan, setPlan] = useState("Free");
  const [checking, setChecking] = useState(true);

  // 🔹 Verifică statusul abonamentului
  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setPlan("Free");
          setChecking(false);
          return;
        }

        const { data } = await API.get("/subscription/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (data?.plan) {
          setPlan(data.plan);
        } else {
          setPlan("Free");
        }
      } catch (err) {
        console.warn("Subscription check failed:", err);
        setPlan("Free");
      } finally {
        setChecking(false);
      }
    };

    checkSubscription();
  }, []);

  // 🔹 Stripe Upgrade
  const handleUpgrade = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Please log in to upgrade your plan.");
        window.location.href = "/login";
        return;
      }

      const { data } = await API.post(
        "/subscription/create-checkout-session",
        { plan: "pro" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (data.url) {
        toast.loading("Redirecting to Stripe checkout...");
        window.location.href = data.url;
      } else {
        toast.error("Failed to start Stripe checkout.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Stripe checkout failed.");
    }
  };

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
    const accent = [58, 110, 165];
    const gray = [60, 60, 60];
    const link = `${window.location.origin}/dashboard/invoices/${invoice._id}`;

    // ===== HEADER =====
    const logoUrl = "https://cdn-icons-png.flaticon.com/512/9429/9429026.png";
    doc.addImage(logoUrl, "PNG", 15, 10, 18, 18);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(22);
    doc.text("BillForge AI", 36, 17);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Smart Invoice Generator", 36, 23);

    // QR code (folosind importul de sus)
    const qrDataUrl = await QRCode.toDataURL(link);
    doc.addImage(qrDataUrl, "PNG", 170, 10, 25, 25);

    // ===== COMPANY INFO =====
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

    // ===== CLIENT INFO =====
    let rightY = 50;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...accent);
    doc.text("Bill To:", 120, rightY);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    rightY += 6;

    const client = invoice.client || {};
    const clientName = client.name || "Unknown Client";
    const clientCompany =
      client.company && client.company !== client.name ? client.company : null;
    const clientEmail = client.email || null;
    const clientPhone = client.phone || null;
    const clientAddress = client.address || null;

    doc.text(clientName, 120, rightY);
    if (clientCompany) {
      rightY += 5;
      doc.text(clientCompany, 120, rightY);
    }
    if (clientEmail) {
      rightY += 5;
      doc.text(clientEmail, 120, rightY);
    }
    if (clientPhone) {
      rightY += 5;
      doc.text(clientPhone, 120, rightY);
    }
    if (clientAddress) {
      rightY += 5;
      doc.text(clientAddress, 120, rightY);
    }

    // ===== INVOICE DETAILS =====
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

    // ===== ITEMS TABLE =====
    const items =
      invoice.items?.map((item) => [
        item.description,
        item.quantity,
        `$${item.unit_price}`,
        `$${item.total}`,
      ]) || [["No items found", "-", "-", "-"]];

    autoTable(doc, {
      startY: infoY + 35,
      head: [["Description", "Quantity", "Unit Price", "Total"]],
      body: items,
      theme: "grid",
      headStyles: {
        fillColor: accent,
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      styles: {
        halign: "center",
        textColor: [50, 50, 50],
        lineColor: [180, 180, 180],
        fontSize: 10,
        fillColor: [245, 247, 250],
      },
      alternateRowStyles: {
        fillColor: [250, 250, 250],
      },
      margin: { left: 15, right: 15 },
    });

    const finalY = doc.lastAutoTable.finalY || infoY + 60;

    // ===== TOTALS =====
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...accent);
    doc.text("Summary", 140, finalY + 10);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(...gray);
    doc.text("Subtotal:", 140, finalY + 18);
    doc.text(`$${invoice.subtotal}`, 175, finalY + 18);
    doc.text("Tax Rate:", 140, finalY + 24);
    doc.text(`${invoice.tax_rate}%`, 175, finalY + 24);
    doc.text("Discount:", 140, finalY + 30);
    doc.text(`${invoice.discount_rate}%`, 175, finalY + 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(...accent);
    doc.text("Total:", 140, finalY + 40);
    doc.text(`$${invoice.total}`, 175, finalY + 40);

    // ===== NOTES =====
    if (invoice.notes) {
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...accent);
      doc.text("Notes:", 15, finalY + 50);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...gray);
      doc.text(invoice.notes, 15, finalY + 58, { maxWidth: 180 });
    }

    // ===== FOOTER =====
    doc.setFontSize(9);
    doc.setTextColor(150, 150, 150);
    doc.text("Generated by BillForge AI • www.billforge.app", 15, 290);

    doc.save(`invoice_${invoice.invoice_number}.pdf`);
    toast.success("PDF downloaded!");
  } catch (err) {
    console.error(err);
    toast.error("Failed to generate PDF");
  }
};


  // 🔄 Afișează loader cât timp verificăm subscriptia
  if (checking) {
    return (
      <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center text-gray-400">
        Checking subscription...
      </div>
    );
  }

  // 🔒 Dacă userul NU are plan Pro sau Enterprise → blocăm AI
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
            <span className="text-[#CB52D4]">Enterprise</span> to unlock
            AI-powered invoice generation.
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

  // ✅ Dacă are abonament activ (Pro/Enterprise) — AI Generator normal
  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-10 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <Brain className="text-[#80FFF9]" size={26} />
            AI Invoice Generator
          </h1>
          <p className="text-gray-400 text-sm">
            Paste text below and let Gemini generate your invoice.
          </p>
        </div>
        <div className="px-4 py-2 rounded-full border border-[#80FFF9]/30 bg-[#80FFF9]/10 text-[#80FFF9] text-sm">
          {plan} Plan Active
        </div>
      </div>

      {/* Input */}
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

      {/* Loader / Result */}
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
