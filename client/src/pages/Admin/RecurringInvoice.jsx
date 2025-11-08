import React, { useEffect, useState } from "react";
import { Repeat, Eye, Edit, Trash2, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const RecurringInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Fetch recurring invoices from backend
  const fetchRecurringInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please log in to view invoices");
        return;
      }

      const { data } = await API.get("/invoices", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const recurringOnly = data.filter((inv) => inv.recurring === true);
      setInvoices(recurringOnly);
    } catch (err) {
      console.error("❌ Fetch recurring invoices error:", err);
      if (err.response?.status === 401) toast.error("Unauthorized. Please log in again.");
      else toast.error("Failed to load recurring invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  // ✅ Delete recurring invoice
  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await API.delete(`/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Recurring invoice deleted successfully");
      fetchRecurringInvoices();
    } catch {
      toast.error("Failed to delete recurring invoice");
    }
  };

  const handleEdit = (invoiceId) => {
    navigate(`/dashboard/invoices/${invoiceId}/edit`);
  };

  const handleDownload = (invoiceNumber) => {
    toast.info(`Downloading ${invoiceNumber} (mock only)`);
  };

  return (
    <div className="p-8 text-white min-h-screen bg-[#0e0e0e]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-white flex items-center gap-2">
            <Repeat className="text-[#80FFF9]" size={26} />
            Recurring Invoices
          </h1>
          <p className="text-gray-400 text-sm">
            Manage and track your automatically repeating invoices
          </p>
        </div>

        <button
          onClick={() => toast.info("Add Recurring Invoice (coming soon)")}
          className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 px-5 py-2 rounded-md hover:opacity-90 transition"
        >
          <Plus size={18} />
          Add Recurring Invoice
        </button>
      </div>

      {/* Loading or Empty */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 animate-pulse">
          Loading recurring invoices...
        </div>
      ) : invoices.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-white/20 rounded-xl bg-[#1a1a1a]/60">
          <Repeat className="w-16 h-16 text-white/20 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-300">
            No recurring invoices found
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Try adding a recurring invoice to get started.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#1a1a1a]/70 border border-white/10 rounded-xl">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="text-gray-400 text-left border-b border-white/10">
                <th className="p-4">Invoice #</th>
                <th className="p-4">Client</th>
                <th className="p-4">Frequency</th>
                <th className="p-4">Next Billing</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr
                  key={inv._id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="p-4 font-medium text-gray-200">
                    {inv.invoice_number}
                  </td>
                  <td className="p-4">
                    <p className="text-gray-200">{inv.client?.name || "Unknown"}</p>
                    <p className="text-xs text-gray-500">{inv.client?.email || "N/A"}</p>
                  </td>
                  <td className="p-4 text-gray-300">
                    {inv.frequency || "Monthly"}
                  </td>
                  <td className="p-4 text-gray-400">
                    {inv.next_billing || "—"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize ${
                        inv.status === "paid"
                          ? "bg-green-500/20 text-green-400"
                          : inv.status === "sent"
                          ? "bg-blue-500/20 text-blue-400"
                          : inv.status === "draft"
                          ? "bg-gray-500/20 text-gray-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2">
                    <button
                      className="p-2 text-gray-400 hover:text-[#80FFF9] transition"
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEdit(inv._id)}
                      className="p-2 text-gray-400 hover:text-indigo-400 transition"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(inv.invoice_number)}
                      className="p-2 text-gray-400 hover:text-green-400 transition"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(inv._id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RecurringInvoice;
