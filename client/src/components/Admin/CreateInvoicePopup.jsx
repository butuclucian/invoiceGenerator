import React, { useState, useEffect } from "react";
import API from "../../utils/api";
import { toast } from "sonner";

const CreateInvoicePopup = ({ onClose, onCreate }) => {
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    invoice_number: "",
    date: new Date().toISOString().split("T")[0],
    due_date: "",
    client: "",
    status: "draft",
    items: [],
    subtotal: 0,
    total: 0,
  });

  useEffect(() => {
    API.get("/clients")
      .then((res) => setClients(res.data))
      .catch(() => toast.error("Failed to load clients"));
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/invoices", formData);
      onCreate(data);
      toast.success("Invoice created successfully");
      onClose();
    } catch {
      toast.error("Failed to create invoice");
    }
  };

  return (
    <div className="bg-[#1a1a1a] p-6 rounded-xl border border-white/10 w-[450px]">
      <h2 className="text-xl mb-4 text-white">Create Invoice</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="invoice_number"
          placeholder="Invoice number"
          onChange={handleChange}
          required
          className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white"
        />
        <select
          name="client"
          value={formData.client}
          onChange={handleChange}
          className="w-full p-2 bg-[#0e0e0e] border border-white/10 rounded text-white"
          required
        >
          <option value="">Select Client</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 rounded hover:opacity-90"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default CreateInvoicePopup;
