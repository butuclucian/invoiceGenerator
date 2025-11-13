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

  // Fetch invoice + clients
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
        console.error("Failed to load invoice:", err);
        toast.error("Invoice not found or server error");
        navigate("/dashboard/invoices");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  //  Totals calculation
  const calculateTotals = (items, tax_rate, discount_rate) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    const discount_amount = (subtotal * discount_rate) / 100;
    const taxable = subtotal - discount_amount;
    const tax_amount = (taxable * tax_rate) / 100;
    const total = taxable + tax_amount;
    return { subtotal, discount_amount, tax_amount, total };
  };

  //  Item management
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
    const updatedItems = formData.items.filter((_, i) => i !== index);
    const totals = calculateTotals(
      updatedItems,
      formData.tax_rate,
      formData.discount_rate
    );
    setFormData({ ...formData, items: updatedItems, ...totals });
  };

  //  Form change handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Save invoice
  const handleSave = async () => {
    if (!formData.invoice_number || !formData.date || !formData.client) {
      toast.error("Please fill all required fields!");
      return;
    }

    try {
      await API.put(`/invoices/${id}`, formData);
      toast.success("Invoice updated successfully!");
      navigate("/dashboard/invoices");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update invoice");
    }
  };

  const handleReset = () => {
    toast.info("Changes discarded");
    navigate("/dashboard/invoices");
  };

  if (loading || !formData)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading invoice...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0e0e0e] text-white px-10 pt-8 pb-28 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <FileEdit className="text-[#80FFF9]" size={26} />
            Edit Invoice
          </h1>
          <p className="text-gray-400 text-sm">Update existing invoice details</p>
          <p className="text-gray-500 text-xs mt-2">
            <span className="text-red-500">*</span> Required fields
          </p>
        </div>
      </div>

      {/* Form */}
      <form className="max-w-6xl mx-auto space-y-12">
        
        {/*  SECTION 1: Invoice Details  */}
        <section>

          {/* title */}
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2">
            Invoice Details
          </h2>


          {/* invoice nr, date, due date */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* invoice nr */}
            <div>
              <label className="block text-gray-300 mb-1">
                Invoice Number <span className="text-red-500">*</span>
              </label>
              <input type="text" name="invoice_number" value={formData.invoice_number} onChange={handleChange} placeholder="INV-0001" className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9]"/>
            </div>

            {/* date */}
            <div>
              <label className="block text-gray-300 mb-1">
                Date <span className="text-red-500">*</span>
              </label>
              <input type="date" name="date" value={formData.date?.split("T")[0] || ""} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9]"/>
            </div>

            {/* due date */}
            <div>
              <label className="block text-gray-300 mb-1">Due Date</label>
              <input type="date" name="due_date" value={formData.due_date?.split("T")[0] || ""} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9]"/>
            </div>

          </div>

          {/* client + status */}
          <div className="grid md:grid-cols-2 gap-8 mt-6">
            
            {/* client */}
            <div>
              <label className="block text-gray-300 mb-1">
                Client <span className="text-red-500">*</span>
              </label>
              <select name="client" value={formData.client?._id || formData.client || ""} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9]">
                <option value="">Select client</option>
                {clients.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} — {c.email}
                  </option>
                ))}
              </select>
            </div>

            {/* status */}
            <div>
              <label className="block text-gray-300 mb-1">Status</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9]">
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            
          </div>

        </section>

        {/*  SECTION 2: Items  */}
        <section>

          {/* title + add item button */}
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2 flex justify-between items-center">
            Items
            <button type="button" onClick={addItem} className="flex items-center gap-2 text-[#80FFF9] hover:text-white transition">
              <Plus size={18} /> Add Item
            </button>
          </h2>

          {/* form */}
          {formData.items.map((item, index) => (
            <div key={index} className="grid md:grid-cols-12 gap-4 items-end p-4 bg-[#1a1a1a]/70 border border-white/10 rounded-lg mb-3">

              {/* description */}
              <div className="md:col-span-5">
                <label className="text-gray-300 block mb-1">Description</label>
                <input type="text" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)}
                  placeholder="Item description"
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white focus:border-[#80FFF9]"
                />
              </div>

              {/* quantity */}
              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">Quantity</label>
                <input type="number" value={item.quantity} onChange={(e) => handleItemChange(index, "quantity", e.target.value)} className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white focus:border-[#80FFF9]"/>
              </div>

              {/* unit price */}
              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">Unit Price</label>
                <input type="number" value={item.unit_price} onChange={(e) => handleItemChange(index, "unit_price", e.target.value)}
                  className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-white focus:border-[#80FFF9]"/>
              </div>

              {/* total */}
              <div className="md:col-span-2">
                <label className="text-gray-300 block mb-1">Total</label>
                <input readOnly value={`$${item.total.toFixed(2)}`} className="w-full bg-transparent border border-white/10 rounded-md px-3 py-2 text-gray-400"/>
              </div>

              {/* remove button */}
              <div className="md:col-span-1 flex justify-end">
                <button type="button" onClick={() => removeItem(index)} className="p-2 bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-md transition">
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </section>

        {/*  SECTION 3: Additional + Recurring  */}
        <section>

          {/* title */}
          <h2 className="text-xl font-semibold mb-4 text-[#80FFF9] border-b border-white/10 pb-2">
            Additional Information
          </h2>

          {/* tax rate */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-gray-300 block mb-1">Tax Rate (%)</label>
              <input type="number" value={formData.tax_rate} onChange={(e) =>
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
                className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9]"
              />
            </div>

            {/* discount rate */}
            <div>
              <label className="text-gray-300 block mb-1">
                Discount Rate (%)
              </label>
              <input type="number" value={formData.discount_rate} onChange={(e) =>
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
                className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9]"
              />
            </div>

          </div>

          {/* recurring Invoice */}
          <div className="mt-8">

            {/* title */}
            <h3 className="text-lg font-semibold text-[#80FFF9] mb-3">
              Recurring Invoice
            </h3>

            {/* checkbox + text */}
            <div className="flex items-center gap-3 mb-4">
              <input type="checkbox" id="recurring" checked={formData.recurring || false} onChange={(e) =>
                  setFormData({ ...formData, recurring: e.target.checked })
                }
                className="w-5 h-5 accent-[#80FFF9] cursor-pointer"
              />
              <label htmlFor="recurring" className="text-gray-300 text-sm select-none cursor-pointer">
                Mark this invoice as recurring (auto-generated periodically)
              </label>
            </div>

            {/* recurring form */}
            {formData.recurring && (
              <div className="grid md:grid-cols-2 gap-6">

                {/* freq */}
                <div>
                  <label className="text-gray-300 block mb-1">Frequency</label>
                  <select name="frequency" value={formData.frequency || "monthly"} onChange={handleChange} className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9]">
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                {/* next billing  */}
                <div>
                  <label className="text-gray-300 block mb-1">
                    Next Billing Date
                  </label>
                  <input type="date" name="next_billing" value={
                      formData.next_billing
                        ? formData.next_billing.split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="w-full bg-[#1a1a1a]/80 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-[#80FFF9]"
                  />
                </div>

              </div>
            )}

          </div>

        </section>

        {/* subtotal, discount, tax, total */}
        <div className="mt-6 space-y-2 text-gray-300 border-t border-white/10 pt-4">
          {/* subtotal */}
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>${formData.subtotal.toFixed(2)}</span>
          </div>

          {/* discount */}
          {formData.discount_amount > 0 && (
            <div className="flex justify-between text-red-400">
              <span>Discount:</span>
              <span>- ${formData.discount_amount.toFixed(2)}</span>
            </div>
          )}

          {/* tax */}
          {formData.tax_amount > 0 && (
            <div className="flex justify-between text-[#80FFF9]">
              <span>Tax:</span>
              <span>+ ${formData.tax_amount.toFixed(2)}</span>
            </div>
          )}

          {/* total */}
          <div className="flex justify-between font-semibold text-[#80FFF9] border-t border-white/10 pt-2 text-lg">
            <span>Total:</span>
            <span>${formData.total.toFixed(2)}</span>
          </div>

        </div>

        {/* footer */}
        <div className="fixed bottom-0 right-0 left-64 bg-[#111111]/90 border-t border-white/10 backdrop-blur-md py-4 z-40">
          <div className="flex justify-center gap-4 pr-8">
            <button type="button" onClick={handleReset} className="flex items-center gap-2 px-5 py-2 border border-white/20 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition">
              <RotateCcw size={16} />
              Reset
            </button>
            <button type="button" onClick={() => navigate(-1)} className="flex items-center gap-2 px-5 py-2 border border-white/20 rounded-md text-gray-300 hover:text-white hover:bg-white/10 transition">
              <X size={16} />
              Cancel
            </button>
            <button type="button" onClick={handleSave} className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:opacity-90 transition">
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
