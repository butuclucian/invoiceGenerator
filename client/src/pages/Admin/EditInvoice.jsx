import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Save, X, RotateCcw, FileEdit, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import API from "../../utils/api";

const EditInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(null);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState("RON");

  // State local pentru taxe randate în UI (Mongoose nu le stochează direct ca sume)
  const [uiAmounts, setUiAmounts] = useState({
    tax_amount: 0,
    discount_amount: 0
  });

  // ========== FETCH INVOICE + CLIENTS ==========
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, clientsRes] = await Promise.all([
          API.get(`/invoices/${id}`),
          API.get("/clients"),
        ]);
        
        const invData = invoiceRes.data;
        setFormData({
          ...invData,
          // Convertim ID-ul de client la string pur dacă vine populate din spate
          client: invData.client?._id || invData.client || "",
          series: invData.series || "INV",
          payment_method: invData.payment_method || "not_paid",
          paid_amount: invData.paid_amount || 0,
          paid_at: invData.paid_at ? invData.paid_at.split("T")[0] : "",
          date: invData.date ? invData.date.split("T")[0] : "",
          due_date: invData.due_date ? invData.due_date.split("T")[0] : "",
          next_billing: invData.next_billing ? invData.next_billing.split("T")[0] : "",
          notes: invData.notes || "",
          payment_terms: invData.payment_terms || "",
          recurring: invData.recurring ?? false,
          frequency: invData.frequency || "monthly"
        });

        if (invData.currency) setCurrency(invData.currency);

        setClients(clientsRes.data);

        // Calculăm sumele UI inițiale
        const discountAmount = (invData.subtotal * invData.discount_rate) / 100;
        const taxAmount = ((invData.subtotal - discountAmount) * invData.tax_rate) / 100;
        setUiAmounts({ tax_amount: taxAmount, discount_amount: discountAmount });

      } catch (err) {
        console.error(err);
        toast.error("Invoice not found or failed to load data.");
        navigate("/dashboard/invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  // ========== CALCUL TOTALS ==========
  const calculateTotals = (items, tax_rate, discount_rate) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount_amount = (subtotal * discount_rate) / 100;
    const taxable = subtotal - discount_amount;
    const tax_amount = (taxable * tax_rate) / 100;
    const total = taxable + tax_amount;
    
    return { 
      tax_amount, 
      discount_amount, 
      mappedFields: { subtotal, total, tax_rate, discount_rate } 
    };
  };

  // ========== HANDLE CHANGES ==========
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = field === "description" ? value : parseFloat(value) || 0;

    if (field === "quantity" || field === "unit_price") {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unit_price;
    }

    const totals = calculateTotals(updatedItems, formData.tax_rate, formData.discount_rate);
    setFormData({ ...formData, items: updatedItems, ...totals.mappedFields });
    setUiAmounts({ tax_amount: totals.tax_amount, discount_amount: totals.discount_amount });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { description: "", quantity: 1, unit_price: 0, total: 0 }],
    });
  };

  const removeItem = (index) => {
    if (formData.items.length === 1) return;
    const updated = formData.items.filter((_, i) => i !== index);
    const totals = calculateTotals(updated, formData.tax_rate, formData.discount_rate);
    setFormData({ ...formData, items: updated, ...totals.mappedFields });
    setUiAmounts({ tax_amount: totals.tax_amount, discount_amount: totals.discount_amount });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };

    if (name === "tax_rate" || name === "discount_rate") {
      const taxRate = name === "tax_rate" ? parseFloat(value) || 0 : formData.tax_rate;
      const discountRate = name === "discount_rate" ? parseFloat(value) || 0 : formData.discount_rate;
      
      const totals = calculateTotals(formData.items, taxRate, discountRate);
      setFormData({ ...updatedFormData, ...totals.mappedFields });
      setUiAmounts({ tax_amount: totals.tax_amount, discount_amount: totals.discount_amount });
    } else {
      setFormData(updatedFormData);
    }
  };

  const handleSave = async () => {
    if (!formData.client) return toast.error("Please select a client");
    if (formData.items.some((item) => !item.description)) return toast.error("Please complete all item descriptions");

    // Curățăm datele goale înainte de trimitere ca să prevenim erorile CastError din MongoDB
    const payload = { ...formData, currency };
    if (!payload.due_date) delete payload.due_date;
    if (!payload.next_billing) delete payload.next_billing;
    if (!payload.paid_at) delete payload.paid_at;

    try {
      await API.put(`/invoices/${id}`, payload);
      toast.success("Invoice updated successfully!");
      navigate("/dashboard/invoices");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update invoice");
    }
  };

  const handleReset = () => navigate("/dashboard/invoices");

  if (loading || !formData)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 font-mono text-xs uppercase tracking-wider">
        Loading invoice...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-10 pt-8 pb-32 overflow-hidden">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            <FileEdit className="text-[#80FFF9]" size={26} />
            Edit Invoice
          </h1>
          <p className="text-gray-400 text-sm">Update existing invoice details and payment metrics</p>
        </div>
      </div>

      {/* FORM */}
      <form className="max-w-6xl mx-auto space-y-10 relative z-10" onSubmit={(e) => e.preventDefault()}>
        
        {/* SECTION 1: INVOICE IDENTIFICATION */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h2 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-2">
            Invoice Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Serie</label>
              <input name="series" value={formData.series} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#80FFF9] outline-none transition"/>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Invoice Number <span className="text-red-500">*</span></label>
              <input name="invoice_number" value={formData.invoice_number} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#80FFF9] outline-none transition" required/>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Date <span className="text-red-500">*</span></label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#80FFF9] outline-none transition" required />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Due Date</label>
              <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#80FFF9] outline-none transition" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Client <span className="text-red-500">*</span></label>
              <select name="client" value={formData.client} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#80FFF9] outline-none transition" required>
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} {c.brand ? `(${c.brand})` : ""} — {c.email}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Status <span className="text-red-500">*</span></label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-lg px-3 py-2 text-sm focus:border-[#80FFF9] outline-none transition">
                <option value="draft">Draft</option>
                <option value="pending">Pending Review</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: ITEMS MODULE */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h2 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-2 flex justify-between items-center">
            Items Inventory
            <button type="button" onClick={addItem} className="flex items-center gap-1.5 text-xs text-[#80FFF9] bg-[#80FFF9]/5 border border-[#80FFF9]/20 rounded-lg px-3 py-1 hover:bg-[#80FFF9]/10 transition">
              <Plus size={14} /> Add Line
            </button>
          </h2>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-[#161616] border border-white/5 rounded-xl items-end">
                <div className="md:col-span-5">
                  <label className="text-[11px] font-mono uppercase text-gray-400 block mb-1">Description <span className="text-red-500">*</span></label>
                  <input value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-md px-3 py-1.5 text-sm focus:border-[#80FFF9] outline-none transition" required/>
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-gray-400 block mb-1">Quantity <span className="text-red-500">*</span></label>
                  <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-md px-3 py-1.5 text-sm focus:border-[#80FFF9] outline-none transition" required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-gray-400 block mb-1">Unit Price <span className="text-red-500">*</span></label>
                  <input type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value)} className="w-full bg-[#121212] border border-white/10 rounded-md px-3 py-1.5 text-sm focus:border-[#80FFF9] outline-none transition" required />
                </div>
                <div className="md:col-span-2">
                  <label className="text-[11px] font-mono uppercase text-gray-500 block mb-1">Total Line</label>
                  <div className="w-full bg-[#121212]/50 border border-white/5 rounded-md px-3 py-1.5 text-sm text-gray-400 font-mono">
                    {item.total.toFixed(2)} {currency}
                  </div>
                </div>
                <div className="md:col-span-1 flex justify-end">
                  <button type="button" onClick={() => removeItem(index)} className="p-2 bg-red-500/5 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 text-red-400 rounded-md transition" disabled={formData.items.length === 1}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: ADVANCED BALANCES & TAXES */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h2 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-2">
            Taxing & Financial Summary
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Tax Rate (TVA %) <span className="text-red-500">*</span></label>
              <input type="number" name="tax_rate" value={formData.tax_rate} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-md px-4 py-2 text-sm focus:border-[#80FFF9] outline-none transition" required />
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Discount Rate (%) <span className="text-red-500">*</span></label>
              <input type="number" name="discount_rate" value={formData.discount_rate} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-md px-4 py-2 text-sm focus:border-[#80FFF9] outline-none transition" required />
            </div>
          </div>

          {/* 💳 LOGICA DE ÎNCASĂRI STRATEGICE MAPATĂ DIRECT ÎN EDIT */}
          <div className="grid md:grid-cols-3 gap-6 pt-2">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Payment Method</label>
              <select name="payment_method" value={formData.payment_method} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-md px-4 py-2 text-sm focus:border-[#80FFF9] outline-none transition">
                <option value="not_paid">Not Paid (Neîncasat)</option>
                <option value="cash">Cash (Numerar)</option>
                <option value="card">Card POS</option>
                <option value="bank_transfer">Bank Transfer (Ordin de plată)</option>
                <option value="stripe">Stripe Online</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Paid Amount ({currency})</label>
              <input type="number" name="paid_amount" value={formData.paid_amount} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-md px-4 py-2 text-sm focus:border-[#80FFF9] outline-none transition"/>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Payment Date (Paid At)</label>
              <input type="date" name="paid_at" value={formData.paid_at} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-md px-4 py-2 text-sm focus:border-[#80FFF9] outline-none transition"/>
            </div>
          </div>

          {/* RENDERING MATHEMATICAL TOTALS */}
          <div className="mt-4 space-y-2 text-gray-400 bg-[#141414] border border-white/5 p-4 rounded-xl font-mono text-xs max-w-md ml-auto">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="text-white">{formData.subtotal.toFixed(2)} {currency}</span>
            </div>
            {uiAmounts.discount_amount > 0 && (
              <div className="flex justify-between text-red-400/90">
                <span>Discount ({formData.discount_rate}%):</span>
                <span>- {uiAmounts.discount_amount.toFixed(2)} {currency}</span>
              </div>
            )}
            {uiAmounts.tax_amount > 0 && (
              <div className="flex justify-between text-teal-400/90">
                <span>Tax / TVA ({formData.tax_rate}%):</span>
                <span>+ {uiAmounts.tax_amount.toFixed(2)} {currency}</span>
              </div>
            )}
            <div className="flex justify-between font-black text-[#80FFF9] border-t border-white/5 pt-2 text-base">
              <span>TOTAL FACTURĂ:</span>
              <span>{formData.total.toFixed(2)} {currency}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Payment Terms</label>
              <input type="text" name="payment_terms" placeholder="e.g. Net 30" value={formData.payment_terms} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-md px-4 py-2 text-sm focus:border-[#80FFF9] outline-none transition"/>
            </div>
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Notes</label>
              <textarea name="notes" placeholder="Additional info..." value={formData.notes} onChange={handleChange} rows="2" className="w-full bg-[#161616] border border-white/10 rounded-md px-4 py-2 text-sm focus:border-[#80FFF9] outline-none transition resize-none"/>
            </div>
          </div>
        </div>

        {/* SECTION 4: RECURRING CORES */}
        <div className="bg-[#121212]/40 border border-white/5 rounded-2xl p-6 backdrop-blur-xl space-y-6">
          <h2 className="text-sm font-mono font-bold text-indigo-400 uppercase tracking-wider border-b border-white/5 pb-2">
            Recurring Invoice Automation
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input type="checkbox" id="recurring" checked={formData.recurring} onChange={(e) => setFormData({...formData, recurring: e.target.checked})} className="w-4 h-4 accent-[#80FFF9] cursor-pointer bg-[#161616] border-white/10 rounded"/>
              <label htmlFor="recurring" className="text-gray-300 text-sm select-none cursor-pointer">
                Mark this invoice as recurring (auto-generated periodically)
              </label>
            </div>

            {formData.recurring && (
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Frequency <span className="text-red-500">*</span></label>
                  <select name="frequency" value={formData.frequency} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-md px-4 py-2 text-sm focus:border-[#80FFF9] outline-none transition">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-gray-400 block mb-2">Next Billing Date <span className="text-red-500">*</span></label>
                  <input type="date" name="next_billing" value={formData.next_billing} onChange={handleChange} className="w-full bg-[#161616] border border-white/10 rounded-md px-4 py-2 text-sm focus:border-[#80FFF9] outline-none transition"/>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== STICKY FOOTER ===== */}
        <div className="fixed bottom-0 right-0 left-0 md:left-64 bg-[#111111]/90 border-t border-white/10 backdrop-blur-md py-4 z-40">
          <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 px-4">
            <button type="button" onClick={handleReset} className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 border border-white/20 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-300 hover:bg-white/10 hover:text-white transition duration-300" >
              <RotateCcw size={14} /> Reset
            </button>
            <button type="button" onClick={() => navigate(-1)} className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 border border-white/20 rounded-xl text-xs font-mono uppercase tracking-wider text-gray-300 hover:bg-white/10 hover:text-white transition duration-300" >
              <X size={14} /> Cancel
            </button>
            <button type="button" onClick={handleSave} className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500/20 to-indigo-600/20 hover:from-teal-500/30 hover:to-indigo-600/30 border border-teal-500/30 hover:border-teal-400/60 text-xs font-mono uppercase tracking-wider text-[#80FFF9] font-bold shadow-lg transition duration-300" >
              <Save size={14} /> Save Changes
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};

export default EditInvoice;