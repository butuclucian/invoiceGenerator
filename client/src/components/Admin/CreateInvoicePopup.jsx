import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { toast } from "sonner";
import { PlusCircle, Trash2 } from "lucide-react";

const CreateInvoicePopup = ({ onClose, onCreate }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    invoice_number: "",
    date: new Date().toISOString().split("T")[0],
    due_date: "",
    client: "",
    status: "draft",
    items: [{ description: "", quantity: 1, unit_price: 0, total: 0 }],
    tax_rate: 0,
    discount_rate: 0,
    subtotal: 0,
    total: 0,
    notes: "",
    payment_terms: "",
    recurring: false,
    frequency: "monthly",
  });

  //Fetch clients for dropdown
  useEffect(() => {
    API.get("/clients")
      .then((res) => setClients(res.data))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  //Update totals dynamically
  useEffect(() => {
    const subtotal = formData.items.reduce(
      (acc, item) => acc + Number(item.total || 0),
      0
    );
    const tax = (subtotal * Number(formData.tax_rate)) / 100;
    const discount = (subtotal * Number(formData.discount_rate)) / 100;
    const total = subtotal + tax - discount;
    setFormData((prev) => ({
      ...prev,
      subtotal,
      total: Number(total.toFixed(2)),
    }));
  }, [formData.items, formData.tax_rate, formData.discount_rate]);

  // Handle change for simple fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle change for items
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    if (field === "quantity" || field === "unit_price") {
      const quantity = Number(updatedItems[index].quantity) || 0;
      const unit_price = Number(updatedItems[index].unit_price) || 0;
      updatedItems[index].total = quantity * unit_price;
    }

    setFormData({ ...formData, items: updatedItems });
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
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) return toast.error("Unauthorized");

      const { data } = await API.post("/invoices", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Invoice created successfully");
      onCreate && onCreate(data);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Invoice Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="invoice_number" placeholder="Invoice number" value={formData.invoice_number} onChange={handleChange} required className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white" />
          <select name="client" value={formData.client} onChange={handleChange} className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white" required >
            <option value="">Select Client</option>
            {clients.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <div>
            <label className="text-xs text-gray-400">Date</label>
            <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Due Date</label>
            <input type="date" name="due_date" value={formData.due_date} onChange={handleChange} className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white" />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="text-xs text-gray-400">Status</label>
          <select name="status" value={formData.status} onChange={handleChange} className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white" >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Items */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Items</h3>
            <button type="button" onClick={addItem} className="flex items-center gap-1 text-[#80FFF9] hover:opacity-80" >
              <PlusCircle size={18} /> Add Item
            </button>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-2 mb-2 bg-[#111]/50 p-2 rounded-lg border border-white/10" >
              <input placeholder="Description" value={item.description} onChange={(e) =>
                  handleItemChange(index, "description", e.target.value)
                }
                className="col-span-5 p-2 bg-transparent border border-white/10 rounded text-white"
              />

              <input type="number" placeholder="Qty" value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", e.target.value)
                }
                className="col-span-2 p-2 bg-transparent border border-white/10 rounded text-white"
              />

              <input type="number" placeholder="Price" value={item.unit_price}
                onChange={(e) =>
                  handleItemChange(index, "unit_price", e.target.value)
                }
                className="col-span-2 p-2 bg-transparent border border-white/10 rounded text-white"
              />

              <div className="col-span-2 flex items-center justify-center text-[#80FFF9] text-sm font-semibold">
                ${item.total.toFixed(2)}
              </div>

              <button type="button" onClick={() => removeItem(index)} className="col-span-1 flex items-center justify-center text-red-500 hover:text-red-400" >
                <Trash2 size={16} />
              </button>

            </div>
          ))}
        </div>

        {/* Tax & Discount */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400">Tax Rate (%)</label>
            <input type="number" name="tax_rate" value={formData.tax_rate} onChange={handleChange} className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Discount (%)</label>
            <input type="number" name="discount_rate" value={formData.discount_rate} onChange={handleChange} className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white" />
          </div>
        </div>

        {/* Notes + Payment */}
        <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleChange} className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white" />
        <input name="payment_terms" placeholder="Payment Terms" value={formData.payment_terms} onChange={handleChange} className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white" />

        {/* Recurring */}
        <div className="flex items-center gap-3">
          <input type="checkbox" name="recurring" checked={formData.recurring} onChange={handleChange} className="w-4 h-4 accent-[#80FFF9]" />
          <label>Recurring Invoice</label>
          {formData.recurring && (
            <select name="frequency" value={formData.frequency} onChange={handleChange} className="ml-2 bg-[#0e0e0e] border border-white/10 rounded text-white px-2 py-1" >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="yearly">Yearly</option>
            </select>
          )}
        </div>

        {/* Totals */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Subtotal:</span>
            <span>${formData.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Tax:</span>
            <span>{formData.tax_rate}%</span>
          </div>
          <div className="flex justify-between text-gray-400 text-sm">
            <span>Discount:</span>
            <span>{formData.discount_rate}%</span>
          </div>
          <div className="flex justify-between text-[#80FFF9] font-semibold text-lg border-t border-white/10 pt-2">
            <span>Total:</span>
            <span>${formData.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 border border-white/20 rounded-md hover:bg-white/10 transition-all" >
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition-all" >
            {loading ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateInvoicePopup;
