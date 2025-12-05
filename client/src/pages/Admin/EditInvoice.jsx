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

  // FETCH invoice + clients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoiceRes, clientsRes] = await Promise.all([
          API.get(`/invoices/${id}`),
          API.get("/clients"),
        ]);
        setFormData(invoiceRes.data);
        setClients(clientsRes.data);
      } catch (err) {
        toast.error("Invoice not found.");
        navigate("/dashboard/invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // ========== CALCUL TOTALS ==========
  const calculateTotals = (items, tax_rate, discount_rate) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount_amount = (subtotal * discount_rate) / 100;
    const taxable = subtotal - discount_amount;
    const tax_amount = (taxable * tax_rate) / 100;
    const total = taxable + tax_amount;
    return { subtotal, discount_amount, tax_amount, total };
  };

  // ========== HANDLE CHANGES ==========
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] =
      field === "description" ? value : parseFloat(value) || 0;

    if (field === "quantity" || field === "unit_price") {
      updatedItems[index].total =
        updatedItems[index].quantity * updatedItems[index].unit_price;
    }

    const totals = calculateTotals(
      updatedItems,
      formData.tax_rate,
      formData.discount_rate
    );

    setFormData({ ...formData, items: updatedItems, ...totals });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        { description: "", quantity: 1, unit_price: 0, total: 0 },
      ],
    });
  };

  const removeItem = (index) => {
    const updated = formData.items.filter((_, i) => i !== index);
    const totals = calculateTotals(
      updated,
      formData.tax_rate,
      formData.discount_rate
    );
    setFormData({ ...formData, items: updated, ...totals });
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await API.put(`/invoices/${id}`, formData);
      toast.success("Invoice updated!");
      navigate("/dashboard/invoices");
    } catch {
      toast.error("Failed to update invoice");
    }
  };

  const handleReset = () => navigate("/dashboard/invoices");

  if (loading || !formData)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading invoice...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-4 sm:px-10 pt-8 pb-28">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            <FileEdit className="text-[#80FFF9]" size={26} />
            Edit Invoice
          </h1>
          <p className="text-gray-400 text-sm">
            Update existing invoice details
          </p>
        </div>
      </div>

      {/* FORM */}
      <form className="max-w-6xl mx-auto space-y-12">
        {/* ===== SECTION 1: DETAILS ===== */}
        <section>
          <h2 className="text-xl font-semibold text-[#80FFF9] border-b border-white/10 pb-2 mb-4">
            Invoice Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-300 text-sm">Invoice Number <span className="text-red-500">*</span></label>
              <input name="invoice_number" value={formData.invoice_number} onChange={handleChange} className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-lg px-3 py-2 mt-1"/>
            </div>

            <div>
              <label className="text-gray-300 text-sm">Date <span className="text-red-500">*</span></label>
              <input type="date" name="date" value={formData.date?.split("T")[0] || ""} onChange={handleChange} className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-lg px-3 py-2 mt-1" />
            </div>

            <div>
              <label className="text-gray-300 text-sm">Due Date</label>
              <input type="date" name="due_date" value={formData.due_date?.split("T")[0] || ""} onChange={handleChange} className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-lg px-3 py-2 mt-1" />
            </div>
          </div>

          {/* CLIENT + STATUS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="text-gray-300 text-sm">Client <span className="text-red-500">*</span></label>
              <select name="client" value={formData.client?._id || formData.client} onChange={handleChange} className="w-full mt-1 bg-[#1a1a1a]/70 border border-white/10 rounded-lg px-3 py-2">
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-300 text-sm">Status <span className="text-red-500">*</span></label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full mt-1 bg-[#1a1a1a]/70 border border-white/10 rounded-lg px-3 py-2" >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>

        </section>

        {/* ===== SECTION 2: ITEMS ===== */}
        <section>
          <h2 className="text-xl font-semibold text-[#80FFF9] border-b border-white/10 pb-2 mb-4 flex justify-between">
            Items
            <button type="button" onClick={addItem} className="flex items-center gap-2 text-[#80FFF9]" >
              <Plus size={18} /> Add Item
            </button>
          </h2>

          <div className="space-y-4">
          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 bg-[#1a1a1a]/60 border border-white/10 rounded-lg" >
              
              <div className="md:col-span-5">
                <label className="text-gray-300 text-sm">Description <span className="text-red-500">*</span></label>
                <input value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value) } className="w-full mt-1 bg-transparent border border-white/10 rounded-md px-3 py-2"/>
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-300 text-sm">Quantity <span className="text-red-500">*</span></label>
                <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value) } className="w-full mt-1 bg-transparent border border-white/10 rounded-md px-3 py-2" />
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-300 text-sm">Unit Price <span className="text-red-500">*</span></label>
                <input type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value) } className="w-full mt-1 bg-transparent border border-white/10 rounded-md px-3 py-2"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-gray-300 text-sm">Total</label>
                <div className="w-full mt-1 bg-transparent border border-white/10 rounded-md px-3 py-2 text-gray-400">
                  ${item.total.toFixed(2)}
                </div>
              </div>

              <div className="md:col-span-1 flex justify-end items-end">
                <button
                  onClick={() => removeItem(index)}
                  className="p-2 bg-red-500/20 border border-red-500/40 rounded-md"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          </div>
        </section>

        {/* ===== SECTION 3: TOTALS + RECURRING ===== */}
        <section>
          <h2 className="text-xl font-semibold text-[#80FFF9] border-b border-white/10 pb-2 mb-4">
            Additional Information
          </h2>

          {/* taxe rate */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 text-sm">Tax Rate (%) <span className="text-red-500">*</span></label>
              <input type="number" value={formData.tax_rate} onChange={(e) => setFormData({ ...formData, tax_rate: parseFloat(e.target.value) || 0, ...calculateTotals( formData.items, parseFloat(e.target.value) || 0, formData.discount_rate ), }) } className="w-full mt-1 bg-[#1a1a1a]/70 border border-white/10 rounded-lg px-3 py-2" />
            </div>

            {/* discount */}
            <div>
              <label className="text-gray-300 text-sm"> Discount Rate (%) <span className="text-red-500">*</span></label>
              <input type="number" value={formData.discount_rate} onChange={(e) => setFormData({ ...formData, discount_rate: parseFloat(e.target.value) || 0, ...calculateTotals( formData.items, formData.tax_rate, parseFloat(e.target.value) || 0 ), }) } className="w-full mt-1 bg-[#1a1a1a]/70 border border-white/10 rounded-lg px-3 py-2" />
            </div>

          </div>

          {/* TOTALS */}
          <div className="mt-6 space-y-2 text-gray-300 border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${formData.subtotal.toFixed(2)}</span>
            </div>

            {formData.discount_amount > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Discount:</span>
                <span>- ${formData.discount_amount.toFixed(2)}</span>
              </div>
            )}

            {formData.tax_amount > 0 && (
              <div className="flex justify-between text-[#80FFF9]">
                <span>Tax:</span>
                <span>+ ${formData.tax_amount.toFixed(2)}</span>
              </div>
            )}

            {/* total */}
            <div className="flex justify-between text-lg text-[#80FFF9] font-semibold border-t border-white/10 pt-2">
              <span>Total:</span>
              <span>${formData.total.toFixed(2)}</span>
            </div>

          </div>

        </section>

        {/* ===== STICKY FOOTER (FULL RESPONSIVE) ===== */}
        <div className=" fixed bottom-0 right-0  left-0 md:left-64  bg-[#111111]/90 border-t border-white/10  backdrop-blur-md py-3 z-10">
          {/* buttons */}
          <div className="flex flex-row justify-center items-center gap-3 sm:gap-4 px-3">

            <button type="button" onClick={handleReset} className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition" >
              <RotateCcw size={16} />
              Reset
            </button>

            <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-md text-gray-300 hover:bg-white/10 hover:text-white transition" >
              <X size={16} />
              Cancel
            </button>

            <button type="button" onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-600/40 rounded-md hover:bg-indigo-600/30 transition" >
              <Save size={16} />
              Save Changes
            </button>

          </div>

        </div>

      </form>
    </div>
  );
};

export default EditInvoice;
