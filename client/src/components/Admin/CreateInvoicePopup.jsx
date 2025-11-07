import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { toast } from "sonner";
import assets from "../../assets/assets";

const CreateInvoicePopup = ({ onClose, onCreate }) => {
  const { dummyClients } = assets;
  const [formData, setFormData] = useState({
    client_id: "",
    status: "draft",
    total: "",
    notes: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.client_id || !formData.total) {
      toast.error("Please fill all required fields!");
      return;
    }

    const newInvoice = {
      _id: `inv-${Date.now()}`,
      invoice_number: `INV-${Math.floor(Math.random() * 10000)}`,
      date: new Date().toISOString().split("T")[0],
      due_date: "",
      client_id: formData.client_id,
      status: formData.status,
      subtotal: parseFloat(formData.total),
      total: parseFloat(formData.total),
      notes: formData.notes,
    };

    toast.success("Invoice created (dummy)");
    onCreate(newInvoice);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#111111]/95 border border-white/10 rounded-2xl shadow-xl shadow-indigo-500/10 w-full max-w-lg p-8 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Create Quick <span className="text-[#80FFF9]">Invoice</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Client Dropdown */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Client <span className="text-red-500">*</span>
            </label>
            <select
              name="client_id"
              value={formData.client_id}
              onChange={handleChange}
              className="w-full bg-[#0e0e0e]/80 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            >
              <option value="">Select client</option>
              {dummyClients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} — {c.email}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full bg-[#0e0e0e]/80 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          {/* Total */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Total Amount ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="total"
              value={formData.total}
              onChange={handleChange}
              placeholder="Enter total"
              className="w-full bg-[#0e0e0e]/80 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none transition"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Optional notes..."
              className="w-full bg-[#0e0e0e]/80 border border-white/10 rounded-md px-4 py-2 text-white focus:border-[#80FFF9] outline-none resize-none transition"
            ></textarea>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-md border border-white/20 text-gray-300 hover:text-white hover:bg-white/10 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition"
            >
              <Save size={16} />
              Save Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoicePopup;
