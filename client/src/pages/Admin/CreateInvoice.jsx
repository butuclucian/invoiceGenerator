import React, { useState, useEffect } from "react";
import {
  Save,
  X,
  Plus,
  Trash2,
  RotateCcw,
  FilePlus2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import API from "../../utils/api"; // ✅ axios global cu token interceptor

const CreateInvoice = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);

  const [formData, setFormData] = useState({
  invoice_number: `INV-${Date.now()}`,
  date: new Date().toISOString().split("T")[0],
  due_date: "",
  client: "",
  status: "draft",
  items: [{ description: "", quantity: 1, unit_price: 0, total: 0 }],
  tax_rate: 0,
  discount_rate: 0,
  tax_amount: 0,
  discount_amount: 0,
  subtotal: 0,
  total: 0,
  payment_terms: "",
  notes: "",
  recurring: false,       // ✅ nou
  frequency: "monthly",   // ✅ nou
  next_billing: "",       // ✅ nou
});


  // ✅ Fetch clients from backend
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await API.get("/clients");
        setClients(data);
      } catch (err) {
        console.error("Failed to load clients:", err);
        toast.error("Could not load clients from server");
      }
    };
    fetchClients();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const calculateTotals = (items, tax_rate, discount_rate) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount_amount = (subtotal * discount_rate) / 100;
    const taxable = subtotal - discount_amount;
    const tax_amount = (taxable * tax_rate) / 100;
    const total = taxable + tax_amount;
    return { subtotal, discount_amount, tax_amount, total };
  };

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
    if (formData.items.length === 1) return;
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const totals = calculateTotals(
      updatedItems,
      formData.tax_rate,
      formData.discount_rate
    );
    setFormData({ ...formData, items: updatedItems, ...totals });
  };

  const handleReset = () => {
    setFormData({
      invoice_number: `INV-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      due_date: "",
      client: "",
      status: "draft",
      items: [{ description: "", quantity: 1, unit_price: 0, total: 0 }],
      tax_rate: 0,
      discount_rate: 0,
      tax_amount: 0,
      discount_amount: 0,
      subtotal: 0,
      total: 0,
      payment_terms: "",
      notes: "",
    });
    toast.info("Form reset successfully");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.client) return toast.error("Please select a client");
    if (formData.items.some((item) => !item.description))
      return toast.error("Please complete all item descriptions");

    try {
      const { data } = await API.post("/invoices", formData);
      toast.success("Invoice created successfully!");
      navigate("/dashboard/invoices");
    } catch (err) {
      console.error("❌ Create invoice error:", err.response?.data || err);
      toast.error(err.response?.data?.message || "Failed to create invoice");
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-10 pt-8 pb-28 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <FilePlus2 className="text-[#80FFF9]" size={26} />
            Invoices
          </h1>
          <p className="text-gray-400 text-sm">
            Create and manage your billing documents
          </p>
          <p className="text-gray-500 text-xs mt-2">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-12">
        {/* --- SECTION 1: Invoice Details --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2">
            Invoice Details
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="text-gray-300 block mb-1">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="invoice_number"
                value={formData.invoice_number}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
              />
            </div>
            <div>
              <label className="text-gray-300 block mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
              />
            </div>
            <div>
              <label className="text-gray-300 block mb-1">Due Date</label>
              <input
                type="date"
                name="due_date"
                value={formData.due_date}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-10 mt-6">
            <div>
              <label className="text-gray-300 block mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <select
                name="client"
                value={formData.client}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
              >
                <option value="">Select a client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.email}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-300 block mb-1">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
              >
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
          </div>
        </section>

        {/* --- SECTION 2: Items --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2 flex justify-between items-center">
            Items
            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 text-[#80FFF9] hover:text-white transition"
            >
              <Plus size={18} /> Add Item
            </button>
          </h2>

          {formData.items.map((item, index) => (
            <div
              key={index}
              className="grid md:grid-cols-12 gap-4 items-end p-4 bg-[#1a1a1a]/70 border border-white/10 rounded-lg mb-3"
            >
              <div className="md:col-span-5">
                <label className="text-gray-300 block mb-1">
                  Description <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleItemChange(index, "description", e.target.value)
                  }
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white focus:border-[#80FFF9]"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">
                  Quantity <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(index, "quantity", e.target.value)
                  }
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white focus:border-[#80FFF9]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">
                  Unit Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={item.unit_price}
                  onChange={(e) =>
                    handleItemChange(index, "unit_price", e.target.value)
                  }
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white focus:border-[#80FFF9]"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">Total</label>
                <input
                  readOnly
                  value={`$${item.total.toFixed(2)}`}
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-gray-400"
                />
              </div>
              <div className="md:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-md transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </section>

        {/* --- SECTION 3: Additional Info --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2">
            Additional Information
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 block mb-1">Tax Rate (%)</label>
              <input
                type="number"
                value={formData.tax_rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    tax_rate: parseFloat(e.target.value) || 0,
                    ...calculateTotals(
                      formData.items,
                      parseFloat(e.target.value) || 0,
                      formData.discount_rate
                    ),
                  })
                }
                className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
              />
            </div>
            <div>
              <label className="text-gray-300 block mb-1">Discount Rate (%)</label>
              <input
                type="number"
                value={formData.discount_rate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    discount_rate: parseFloat(e.target.value) || 0,
                    ...calculateTotals(
                      formData.items,
                      formData.tax_rate,
                      parseFloat(e.target.value) || 0
                    ),
                  })
                }
                className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
              />
            </div>
          </div>

          <div className="mt-4 space-y-2 text-gray-300 border-t border-white/10 pt-4">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${formData.subtotal.toFixed(2)}</span>
            </div>

            {formData.discount_amount > 0 && (
              <div className="flex justify-between text-red-400">
                <span>Discount ({formData.discount_rate}%):</span>
                <span>- ${formData.discount_amount.toFixed(2)}</span>
              </div>
            )}

            {formData.tax_amount > 0 && (
              <div className="flex justify-between text-[#80FFF9]">
                <span>Tax ({formData.tax_rate}%):</span>
                <span>+ ${formData.tax_amount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between font-semibold text-[#80FFF9] border-t border-white/10 pt-2 text-lg">
              <span>Total:</span>
              <span>${formData.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="text-gray-300 block mb-1">Payment Terms</label>
              <input
                type="text"
                name="payment_terms"
                placeholder="e.g. Net 30"
                value={formData.payment_terms}
                onChange={handleChange}
                className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
              />
            </div>
            <div>
              <label className="text-gray-300 block mb-1">Notes</label>
              <textarea
                name="notes"
                placeholder="Additional information..."
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] resize-none"
              />
            </div>
          </div>
        </section>

        {/* --- SECTION 4: Recurring Settings --- */}
        <section>
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2">
            Recurring Invoice
          </h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="recurring"
                checked={formData.recurring}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recurring: e.target.checked,
                  })
                }
                className="w-5 h-5 accent-[#80FFF9] cursor-pointer"
              />
              <label
                htmlFor="recurring"
                className="text-gray-300 text-sm select-none cursor-pointer"
              >
                Mark this invoice as recurring (auto-generated periodically)
              </label>
            </div>

            {formData.recurring && (
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div>
                  <label className="text-gray-300 block mb-1">
                    Frequency <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="frequency"
                    value={formData.frequency}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">
                    Next Billing Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="next_billing"
                    value={formData.next_billing}
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a]/70 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9]"
                  />
                </div>
              </div>
            )}
          </div>
        </section>


        {/* Sticky Footer */}
        <div className="fixed bottom-0 right-0 left-64 bg-[#111111]/90 border-t border-white/10 backdrop-blur-md py-4 z-40">
          <div className="flex justify-center gap-4 pr-8">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-2 border border-white/20 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              <RotateCcw size={16} />
              Reset
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-5 py-2 border border-white/20 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              <X size={16} />
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition"
            >
              <Save size={16} />
              Save Invoice
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoice;
