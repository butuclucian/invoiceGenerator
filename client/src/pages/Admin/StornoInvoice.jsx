import React, { useState, useEffect } from "react";
import { Save, X, RotateCcw, RefreshCw } from "lucide-react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "sonner";
import API from "../../utils/api";

const StornoInvoice = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [initialInvoice, setInitialInvoice] = useState(null);
  const [currency, setCurrency] = useState("RON");

  const [formData, setFormData] = useState({
    invoice_number: "Loading...",
    date: new Date().toISOString().split("T")[0],
    due_date: new Date().toISOString().split("T")[0],
    client: "",
    clientName: "",
    status: "draft",
    items: [],
    tax_rate: 0,
    discount_rate: 0,
    tax_amount: 0,
    discount_amount: 0,
    subtotal: 0,
    total: 0,
    notes: "",
  });

  useEffect(() => {
    const initializeStorno = async () => {
      try {
        const invoiceId = id || location.state?.invoiceId;
        if (!invoiceId) {
          toast.error("No invoice ID provided for storno");
          navigate("/dashboard/invoices");
          return;
        }

        const { data: originalInvoice } = await API.get(`/invoices/${invoiceId}`);
        setInitialInvoice(originalInvoice);
        
        if (originalInvoice.currency) {
          setCurrency(originalInvoice.currency);
        }

        let nextInvoiceNumber = "INV-0001";
        try {
          const { data: invoicesData } = await API.get("/invoices");
          const realInvoicesCount = invoicesData.filter(inv => inv.status !== "pending").length;
          const paddedNumber = String(realInvoicesCount + 1).padStart(4, "0");
          nextInvoiceNumber = `INV-${paddedNumber}`;
        } catch (invErr) {
          console.error("Failed to calculate next invoice number:", invErr);
        }

        const stornoItems = originalInvoice.items.map(item => {
          const negativeQty = item.quantity * -1;
          return {
            description: `[Storno] ${item.description}`,
            quantity: negativeQty,
            unit_price: item.unit_price,
            total: negativeQty * item.unit_price
          };
        });

        const subtotal = stornoItems.reduce((sum, item) => sum + item.total, 0);
        const discount_amount = (subtotal * originalInvoice.discount_rate) / 100;
        const taxable = subtotal - discount_amount;
        const tax_amount = (taxable * originalInvoice.tax_rate) / 100;
        const total = taxable + tax_amount;

        setFormData({
          invoice_number: nextInvoiceNumber,
          date: new Date().toISOString().split("T")[0],
          due_date: new Date().toISOString().split("T")[0],
          client: originalInvoice.client?._id || originalInvoice.client,
          clientName: originalInvoice.client?.name || "Original Client",
          status: "draft",
          items: stornoItems,
          tax_rate: originalInvoice.tax_rate,
          discount_rate: originalInvoice.discount_rate,
          tax_amount,
          discount_amount,
          subtotal,
          total,
          notes: `Factură de stornare pentru documentul nr. ${originalInvoice.invoice_number}.`,
        });

      } catch (err) {
        toast.error("Could not load original invoice data");
      }
    };

    initializeStorno();
  }, [id, location.state]);

  const handleDateChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    if (!initialInvoice) return;
    toast.info("Form reset to original storno values");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/invoices", formData);
      toast.success(`Storno invoice ${formData.invoice_number} generated successfully!`);
      navigate("/dashboard/invoices");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save storno invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#0e0e0e] relative pt-30 space-y-8">
      
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <RefreshCw className="text-[#80FFF9]" size={26} />
            Storno Invoice
          </h1>
          <p className="text-gray-400 text-sm">
            Issue a reversal or credit note for an existing invoice with negative values
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-12">
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2">
            Storno Reference Details
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-300 block mb-1">New Invoice Number</label>
              <input type="text" readOnly value={formData.invoice_number} className="w-full bg-[#1a1a1a]/40 border border-white/5 rounded-md px-4 py-2 text-gray-400 outline-none"/>
            </div>

            <div>
              <label className="text-gray-300 block mb-1">Storno Date</label>
              <input type="date" name="date" value={formData.date} onChange={handleDateChange} className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none"/>
            </div>

            <div>
              <label className="text-gray-300 block mb-1">Original Client (Read-Only)</label>
              <input type="text" readOnly value={formData.clientName} className="w-full bg-[#1a1a1a]/40 border border-white/5 rounded-md px-4 py-2 text-gray-400 outline-none"/>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2">
            Reversed Items (Negative Quantities)
          </h2>

          {formData.items.map((item, index) => (
            <div key={index} className="grid md:grid-cols-12 gap-4 items-end p-4 bg-[#1a1a1a]/70 border border-white/10 rounded-lg mb-3">
              <div className="md:col-span-6">
                <label className="text-gray-300 block mb-1">Description</label>
                <input type="text" readOnly value={item.description} className="w-full bg-transparent border border-white/5 rounded-md px-3 py-2 text-gray-400 outline-none" />
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">Quantity</label>
                <input type="text" readOnly value={item.quantity} className="w-full bg-transparent border border-white/5 rounded-md px-3 py-2 text-red-400 font-medium outline-none text-center" />
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">Unit Price</label>
                <input type="text" readOnly value={`${item.unit_price.toFixed(2)} ${currency}`} className="w-full bg-transparent border border-white/5 rounded-md px-3 py-2 text-gray-400 outline-none text-right" />
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">Total</label>
                <input type="text" readOnly value={`${item.total.toFixed(2)} ${currency}`} className="w-full bg-transparent border border-white/5 rounded-md px-3 py-2 text-red-400 font-medium outline-none text-right" />
              </div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2">
            Summary & Accounting Notes
          </h2>

          <div className="grid md:grid-cols-2 gap-10">
            <div>
              <label className="text-gray-300 block mb-1">Storno Justification Notes</label>
              <textarea name="notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} rows="4" className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] resize-none outline-none"/>
            </div>

            <div className="space-y-2 text-gray-300 bg-[#1a1a1a]/30 p-4 rounded-lg border border-white/5">
              <div className="flex justify-between">
                <span>Subtotal Storno:</span>
                <span className="text-red-400">{formData.subtotal.toFixed(2)} {currency}</span>
              </div>

              {formData.tax_amount !== 0 && (
                <div className="flex justify-between">
                  <span>TVA Inversat ({formData.tax_rate}%):</span>
                  <span className="text-red-400">{formData.tax_amount.toFixed(2)} {currency}</span>
                </div>
              )}

              <div className="flex justify-between font-semibold text-[#80FFF9] border-t border-white/10 pt-2 text-lg">
                <span>Total Credit / Storno:</span>
                <span className="text-[#80FFF9]">{formData.total.toFixed(2)} {currency}</span>
              </div>
            </div>
          </div>
        </section>

        <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-[#111111]/90 border-t border-white/10 backdrop-blur-md py-4 z-40">
          <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 px-4">


            <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 border border-white/20 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-300 hover:text-white hover:bg-white/10 transition duration-300">
              <X size={16} />
              Cancel
            </button>

            <button type="submit" disabled={loading || formData.items.length === 0} className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-600/20 hover:from-teal-500/30 hover:to-indigo-600/30 border border-teal-500/30 hover:border-teal-400/60 text-xs font-mono uppercase tracking-wider text-[#80FFF9] font-bold shadow-lg transition duration-300">
              <Save size={16} />
              {loading ? "Generating Storno..." : "Save Storno Invoice"}
            </button>

          </div>
        </div>

      </form>
    </div>
  );
};

export default StornoInvoice;