import React, { useEffect, useState } from "react";
import { Repeat, Eye, Edit, Trash2, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import API from "../../utils/api";

const RecurringInvoice = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      if (err.response?.status === 401)
        toast.error("Unauthorized. Please log in again.");
      else toast.error("Failed to load recurring invoices");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecurringInvoices();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

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

  const handlePreview = (invoiceId) => {
    navigate(`/dashboard/invoices/${invoiceId}`);
  };

  return (
    <div className="p-4 sm:p-6 md:p-8 text-white min-h-screen bg-[#0e0e0e]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold flex items-center gap-2">
            <Repeat className="text-[#80FFF9]" size={26} />
            Recurring Invoices
          </h1>
          <p className="text-gray-400 text-sm">
            Manage and track your automatically repeating invoices
          </p>
        </div>

        <button onClick={() => toast.info("Add Recurring Invoice (coming soon)")} className="px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-600/40 hover:bg-indigo-600/30 transition flex items-center gap-2 text-sm sm:text-base" >
          <Plus size={18} />
          Add Recurring Invoice
        </button>
      </div>

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
        <>
          <div className="hidden md:block overflow-x-auto bg-[#1a1a1a]/70 border border-white/10 rounded-xl">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-gray-400 border-b border-white/10">
                  <th className="p-4 text-left">Invoice</th>
                  <th className="p-4 text-left">Client</th>
                  <th className="p-4 text-left">Frequency</th>
                  <th className="p-4 text-left">Next Billing</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {invoices.map((inv) => (
                  <tr key={inv._id} className="border-b border-white/5 hover:bg-white/5 transition">
                    <td className="p-4 text-gray-200 text-left align-middle font-medium">
                      {inv.invoice_number}
                    </td>

                    <td className="p-4 text-left align-middle">
                      <p className="text-gray-200">{inv.client?.name || "Unknown"}</p>
                      <p className="text-xs text-gray-500">{inv.client?.email || "N/A"}</p>
                    </td>

                    <td className="p-4 text-left align-middle">
                      {inv.frequency || "Monthly"}
                    </td>

                    <td className="p-4 text-left align-middle">
                      {formatDate(inv.next_billing)}
                    </td>

                    <td className="p-4 text-left align-middle">
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

                    <td className="p-4 text-right flex justify-end gap-2 relative">
                      
                      <button onClick={() => handlePreview(inv._id)} className="group relative p-2 hover:text-[#80FFF9]" >
                        <Eye size={16} />
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2  px-3 py-1.5 bg-black/90 text-[12px] text-white rounded-md shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100 transition-transform duration-150 scale-95 group-hover:scale-100">
                          Preview
                        </span>
                      </button>

                      <button onClick={() => handleEdit(inv._id)} className="group relative p-2 hover:text-indigo-400" >
                        <Edit size={16} />
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2  px-3 py-1.5 bg-black/90 text-[12px] text-white rounded-md  opacity-0 group-hover:opacity-100 transition-transform duration-150  scale-95 group-hover:scale-100">
                          Edit
                        </span>
                      </button>

                      <button onClick={() => handleDownload(inv.invoice_number)} className="group relative p-2 hover:text-green-400" >
                        <Download size={16} />
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2  px-3 py-1.5 bg-black/90 text-[12px] text-white rounded-md shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100 transition-transform duration-150 scale-95 group-hover:scale-100">
                          Download
                        </span>
                      </button>

                      <button onClick={() => handleDelete(inv._id)} className="group relative p-2 hover:text-red-400" >
                        <Trash2 size={16} />
                        <span className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2  px-3 py-1.5 bg-black/90 text-[12px] text-white rounded-md shadow-lg shadow-black/50 opacity-0 group-hover:opacity-100 transition-transform duration-150 scale-95 group-hover:scale-100">
                          Delete
                        </span>
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden flex flex-col gap-4">
            {invoices.map((inv) => (
              <div key={inv._id} className="bg-[#1a1a1a]/70 border border-white/10 rounded-xl p-4 shadow-lg">
                <div className="flex justify-between items-start">
                  <p className="text-lg font-semibold text-gray-200">
                    {inv.invoice_number}
                  </p>

                  <span
                    className={`px-3 py-1 rounded-full text-xs capitalize ${
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
                </div>

                <div className="mt-3 text-sm text-gray-300">
                  <p><span className="text-gray-400">Client:</span> {inv.client?.name || "Unknown"}</p>
                  <p><span className="text-gray-400">Email:</span> {inv.client?.email || "N/A"}</p>
                  <p><span className="text-gray-400">Frequency:</span> {inv.frequency || "Monthly"}</p>
                  <p><span className="text-gray-400">Next Billing:</span> {formatDate(inv.next_billing)}</p>
                </div>

                <div className="mt-4 flex justify-end gap-4 text-gray-400">
                  <button onClick={() => handlePreview(inv._id)} className="hover:text-[#80FFF9]">
                    <Eye size={18} />
                  </button>
                  <button onClick={() => handleEdit(inv._id)} className="hover:text-indigo-400">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => handleDownload(inv.invoice_number)} className="hover:text-green-400">
                    <Download size={18} />
                  </button>
                  <button onClick={() => handleDelete(inv._id)} className="hover:text-red-400">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default RecurringInvoice;
